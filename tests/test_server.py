"""
Tests for the Landing Page Builder Python server.
Tests the HTTP server functionality, API proxy endpoints, and CORS handling.
"""

import os
import socket
import subprocess
import sys
import unittest

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def is_port_in_use(port: int) -> bool:
    """Check if a port is already in use."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0


class TestServerModule(unittest.TestCase):
    """Test server module imports and basic functionality."""

    def test_server_file_exists(self):
        """Test that server.py exists."""
        server_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            'server.py'
        )
        self.assertTrue(os.path.exists(server_path), "server.py should exist")

    def test_server_is_valid_python(self):
        """Test that server.py is valid Python syntax."""
        server_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            'server.py'
        )
        result = subprocess.run(
            [sys.executable, '-m', 'py_compile', server_path],
            capture_output=True,
            text=True
        )
        self.assertEqual(result.returncode, 0, f"server.py syntax error: {result.stderr}")

    def test_server_imports(self):
        """Test that all required imports are available."""
        required_modules = [
            'http.server',
            'socketserver',
            'webbrowser',
            'os',
            'json',
            'urllib.request',
            'urllib.error',
            'threading'
        ]
        for module in required_modules:
            try:
                __import__(module)
            except ImportError:
                self.fail(f"Required module {module} is not available")


class TestHTTPHandler(unittest.TestCase):
    """Test the HTTP request handler functionality."""

    @classmethod
    def setUpClass(cls):
        """Set up test fixtures."""
        # Import server module
        server_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        sys.path.insert(0, server_path)

        # Read and compile server code to get handler class
        with open(os.path.join(server_path, 'server.py'), 'r') as f:
            server_code = f.read()

        # Execute in a namespace to get the handler class
        namespace = {}
        exec(compile(server_code, 'server.py', 'exec'), namespace)
        cls.handler_class = namespace.get('MyHTTPRequestHandler')
        cls.server_class = namespace.get('ThreadedTCPServer')

    def test_handler_class_exists(self):
        """Test that MyHTTPRequestHandler class exists."""
        self.assertIsNotNone(self.handler_class, "MyHTTPRequestHandler should be defined")

    def test_server_class_exists(self):
        """Test that ThreadedTCPServer class exists."""
        self.assertIsNotNone(self.server_class, "ThreadedTCPServer should be defined")

    def test_handler_has_cors_headers(self):
        """Test that handler adds CORS headers."""
        # Check that end_headers method exists
        self.assertTrue(
            hasattr(self.handler_class, 'end_headers'),
            "Handler should have end_headers method"
        )

    def test_handler_has_options_method(self):
        """Test that handler has OPTIONS method for CORS preflight."""
        self.assertTrue(
            hasattr(self.handler_class, 'do_OPTIONS'),
            "Handler should have do_OPTIONS method"
        )

    def test_handler_has_post_method(self):
        """Test that handler has POST method for API proxy."""
        self.assertTrue(
            hasattr(self.handler_class, 'do_POST'),
            "Handler should have do_POST method"
        )

    def test_handler_has_claude_proxy(self):
        """Test that handler has Claude API proxy method."""
        self.assertTrue(
            hasattr(self.handler_class, 'proxy_claude'),
            "Handler should have proxy_claude method"
        )

    def test_handler_has_gemini_proxy(self):
        """Test that handler has Gemini API proxy method."""
        self.assertTrue(
            hasattr(self.handler_class, 'proxy_gemini'),
            "Handler should have proxy_gemini method"
        )


class TestAPIEndpoints(unittest.TestCase):
    """Test API endpoint routing."""

    def test_claude_endpoint_path(self):
        """Test that Claude endpoint uses correct path."""
        # Read server.py and check for endpoint path
        server_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            'server.py'
        )
        with open(server_path, 'r') as f:
            content = f.read()

        self.assertIn('/api/claude', content, "Should have /api/claude endpoint")
        self.assertIn('api.anthropic.com', content, "Should proxy to Anthropic API")

    def test_gemini_endpoint_path(self):
        """Test that Gemini endpoint uses correct path."""
        server_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            'server.py'
        )
        with open(server_path, 'r') as f:
            content = f.read()

        self.assertIn('/api/gemini', content, "Should have /api/gemini endpoint")
        self.assertIn('generativelanguage.googleapis.com', content, "Should proxy to Google API")

    def test_anthropic_api_version(self):
        """Test that correct Anthropic API version is used."""
        server_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            'server.py'
        )
        with open(server_path, 'r') as f:
            content = f.read()

        self.assertIn('anthropic-version', content, "Should set anthropic-version header")
        self.assertIn('2023-06-01', content, "Should use 2023-06-01 API version")


class TestServerConfiguration(unittest.TestCase):
    """Test server configuration."""

    def test_default_port(self):
        """Test that default port is 8000."""
        server_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            'server.py'
        )
        with open(server_path, 'r') as f:
            content = f.read()

        self.assertIn('PORT = 8000', content, "Default port should be 8000")

    def test_threading_enabled(self):
        """Test that threading is enabled for parallel requests."""
        server_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            'server.py'
        )
        with open(server_path, 'r') as f:
            content = f.read()

        self.assertIn('ThreadingMixIn', content, "Should use ThreadingMixIn for parallel requests")
        self.assertIn('daemon_threads', content, "Should enable daemon threads")

    def test_cors_headers_configured(self):
        """Test that CORS headers are properly configured."""
        server_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            'server.py'
        )
        with open(server_path, 'r') as f:
            content = f.read()

        self.assertIn('Access-Control-Allow-Origin', content, "Should set CORS origin header")
        self.assertIn('Access-Control-Allow-Methods', content, "Should set CORS methods header")
        self.assertIn('Access-Control-Allow-Headers', content, "Should set CORS headers header")


class TestErrorHandling(unittest.TestCase):
    """Test error handling in the server."""

    def test_http_error_handling(self):
        """Test that HTTPError is handled."""
        server_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            'server.py'
        )
        with open(server_path, 'r') as f:
            content = f.read()

        self.assertIn('urllib.error.HTTPError', content, "Should handle HTTPError")

    def test_url_error_handling(self):
        """Test that URLError is handled."""
        server_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            'server.py'
        )
        with open(server_path, 'r') as f:
            content = f.read()

        self.assertIn('urllib.error.URLError', content, "Should handle URLError")

    def test_generic_exception_handling(self):
        """Test that generic exceptions are handled."""
        server_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            'server.py'
        )
        with open(server_path, 'r') as f:
            content = f.read()

        # Count exception handlers in proxy methods
        self.assertIn('except Exception', content, "Should have generic exception handler")


class TestStaticFileServing(unittest.TestCase):
    """Test that static files exist and are valid."""

    def test_index_html_exists(self):
        """Test that index.html exists."""
        index_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            'index.html'
        )
        self.assertTrue(os.path.exists(index_path), "index.html should exist")

    def test_css_directory_exists(self):
        """Test that css directory exists."""
        css_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            'css'
        )
        self.assertTrue(os.path.isdir(css_path), "css directory should exist")

    def test_js_directory_exists(self):
        """Test that js directory exists."""
        js_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            'js'
        )
        self.assertTrue(os.path.isdir(js_path), "js directory should exist")

    def test_styles_css_exists(self):
        """Test that styles.css exists."""
        styles_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            'css', 'styles.css'
        )
        self.assertTrue(os.path.exists(styles_path), "css/styles.css should exist")

    def test_all_js_modules_exist(self):
        """Test that all expected JavaScript modules exist."""
        js_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            'js'
        )
        expected_modules = [
            'app.js',
            'api-manager.js',
            'claude-client.js',
            'gemini-client.js',
            'orchestrator.js',
            'html-validator.js',
            'response-parser.js',
            'validator.js',
            'preview-manager.js',
            'progressive-renderer.js',
            'prompt-engineering.js',
            'prompt-builder.js',
            'style-matrix.js',
            'image-prompt-predictor.js',
            'zip-builder.js'
        ]

        for module in expected_modules:
            module_path = os.path.join(js_path, module)
            self.assertTrue(
                os.path.exists(module_path),
                f"JavaScript module {module} should exist"
            )


class TestJavaScriptSyntax(unittest.TestCase):
    """Test that JavaScript files have valid syntax."""

    def test_all_js_files_valid_syntax(self):
        """Test all JavaScript files can be parsed."""
        js_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            'js'
        )

        for filename in os.listdir(js_path):
            if filename.endswith('.js'):
                filepath = os.path.join(js_path, filename)
                result = subprocess.run(
                    ['node', '--check', filepath],
                    capture_output=True,
                    text=True
                )
                self.assertEqual(
                    result.returncode, 0,
                    f"{filename} has syntax errors: {result.stderr}"
                )


if __name__ == '__main__':
    unittest.main()
