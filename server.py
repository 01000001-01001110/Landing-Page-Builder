#!/usr/bin/env python3
"""
Simple HTTP server for Landing Page Builder with API proxy
Run this to serve the application properly with ES6 module support
"""

import http.server
import socketserver
import webbrowser
import os
import json
import urllib.request
import urllib.error
import threading

PORT = 8000

# Enable multi-threaded request handling for parallel API calls
class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    """Handle each request in a new thread for parallel execution"""
    allow_reuse_address = True
    daemon_threads = True  # Clean up threads on shutdown

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, x-api-key, x-goog-api-key')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        """Handle OPTIONS request for CORS preflight"""
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        """Handle POST requests for API proxy"""
        if self.path == '/api/claude':
            self.proxy_claude()
        elif self.path == '/api/gemini':
            self.proxy_gemini()
        else:
            super().do_POST()

    def proxy_claude(self):
        """Proxy requests to Anthropic Claude API with comprehensive debug logging"""
        import sys

        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))

            # Extract API key and request body
            api_key = request_data.get('apiKey')
            body = request_data.get('body')

            # LOG REQUEST (with redacted API key)
            print("\n" + "="*60, file=sys.stderr)
            print("[ClaudeProxy] CLAUDE API REQUEST", file=sys.stderr)
            print("="*60, file=sys.stderr)
            print(f"Model: {body.get('model')}", file=sys.stderr)
            print(f"Max tokens: {body.get('max_tokens')}", file=sys.stderr)
            print(f"Temperature: {body.get('temperature')}", file=sys.stderr)
            print(f"API key present: {'Yes' if api_key else 'No'}", file=sys.stderr)
            print(f"API key prefix: {api_key[:15]}..." if api_key else "N/A", file=sys.stderr)
            print("="*60 + "\n", file=sys.stderr)

            # Make request to Claude API (updated to latest API version)
            req = urllib.request.Request(
                'https://api.anthropic.com/v1/messages',
                data=json.dumps(body).encode('utf-8'),
                headers={
                    'Content-Type': 'application/json',
                    'x-api-key': api_key,
                    'anthropic-version': '2023-06-01'  # Latest stable version
                }
            )

            with urllib.request.urlopen(req) as response:
                response_data = response.read()
                response_text = response_data.decode('utf-8')

                # LOG RESPONSE
                print("\n" + "="*60, file=sys.stderr)
                print("[ClaudeProxy] CLAUDE API RESPONSE", file=sys.stderr)
                print("="*60, file=sys.stderr)
                print(f"Status: {response.status}", file=sys.stderr)
                print(f"Content-Type: {response.headers.get('Content-Type')}", file=sys.stderr)
                print(f"Content-Length: {len(response_data)} bytes", file=sys.stderr)
                print(f"\nResponse preview (first 500 chars):", file=sys.stderr)
                print(response_text[:500], file=sys.stderr)
                print(f"\nResponse preview (last 200 chars):", file=sys.stderr)
                print(response_text[-200:], file=sys.stderr)

                # Check for markdown in the response
                if '```json' in response_text or '```' in response_text:
                    print("\n⚠️  WARNING: Response contains markdown code blocks!", file=sys.stderr)

                # Parse and analyze content
                try:
                    parsed = json.loads(response_text)
                    if 'content' in parsed and len(parsed['content']) > 0:
                        content_text = parsed['content'][0].get('text', '')
                        print(f"\nContent text length: {len(content_text)} chars", file=sys.stderr)
                        print(f"Content text preview (first 300 chars):", file=sys.stderr)
                        print(content_text[:300], file=sys.stderr)

                        # Check if the CONTENT TEXT contains markdown wrapping
                        if '```json' in content_text or '```' in content_text:
                            print("\n🚨 CRITICAL: Content text contains markdown wrapping!", file=sys.stderr)
                            print("This will need to be parsed by the response-parser.js", file=sys.stderr)
                except Exception as e:
                    print(f"\n❌ Response is not valid JSON: {e}", file=sys.stderr)

                print("="*60 + "\n", file=sys.stderr)

                # Send response with proper headers
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(response_data)))
                self.end_headers()
                self.wfile.write(response_data)

        except urllib.error.HTTPError as e:
            # LOG ERROR
            error_body = e.read()
            error_text = error_body.decode('utf-8')
            print(f"\n❌ CLAUDE API ERROR: {e.code}", file=sys.stderr)
            print(f"Error body: {error_text[:500]}", file=sys.stderr)

            self.send_response(e.code)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(error_body)))
            self.end_headers()
            self.wfile.write(error_body)
        except Exception as e:
            # LOG EXCEPTION
            print(f"\n❌ PROXY EXCEPTION: {type(e).__name__}: {e}", file=sys.stderr)
            import traceback
            traceback.print_exc(file=sys.stderr)

            # Internal server error
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            error_response = json.dumps({'error': {'message': str(e)}})
            self.wfile.write(error_response.encode('utf-8'))

    def proxy_gemini(self):
        """Proxy requests to Google Gemini API (Gemini 2.5 Flash Image - NanoBanana)"""
        import sys
        import time

        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))

            # Extract API key and request body
            api_key = request_data.get('apiKey')
            body = request_data.get('body')

            # Log request
            print("\n" + "="*60, file=sys.stderr)
            print("[GeminiProxy] IMAGE GENERATION REQUEST", file=sys.stderr)
            print("="*60, file=sys.stderr)
            prompt_text = body.get('contents', [{}])[0].get('parts', [{}])[0].get('text', 'N/A')
            print(f"Prompt: {prompt_text[:100]}...", file=sys.stderr)
            print(f"API key present: {'Yes' if api_key else 'No'}", file=sys.stderr)

            # Make request to Gemini API - using the preview model
            # Model: gemini-2.5-flash-image-preview (NanoBanana v1)
            url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent'
            print(f"Endpoint: {url}", file=sys.stderr)

            req = urllib.request.Request(
                url,
                data=json.dumps(body).encode('utf-8'),
                headers={
                    'Content-Type': 'application/json',
                    'x-goog-api-key': api_key
                }
            )

            start_time = time.time()
            with urllib.request.urlopen(req, timeout=60) as response:
                response_data = response.read()
                elapsed = time.time() - start_time

                print(f"✅ Response received in {elapsed:.2f}s", file=sys.stderr)
                print(f"Response size: {len(response_data)} bytes", file=sys.stderr)
                print("="*60 + "\n", file=sys.stderr)

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(response_data)

        except urllib.error.HTTPError as e:
            # Forward error response
            error_body = e.read()
            error_text = error_body.decode('utf-8')
            print(f"\n❌ GEMINI API ERROR: {e.code}", file=sys.stderr)
            print(f"Error: {error_text[:500]}", file=sys.stderr)
            self.send_response(e.code)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(error_body)
        except urllib.error.URLError as e:
            # Network/timeout error
            print(f"\n❌ GEMINI NETWORK ERROR: {e.reason}", file=sys.stderr)
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            error_response = json.dumps({'error': {'message': f'Network error: {e.reason}'}})
            self.wfile.write(error_response.encode('utf-8'))
        except Exception as e:
            # Internal server error
            print(f"\n❌ GEMINI PROXY ERROR: {type(e).__name__}: {e}", file=sys.stderr)
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            error_response = json.dumps({'error': {'message': str(e)}})
            self.wfile.write(error_response.encode('utf-8'))

def main():
    # Change to the directory containing this script
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    with ThreadedTCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        url = f"http://localhost:{PORT}"
        print("=" * 60)
        print("Landing Page Builder Server")
        print("=" * 60)
        print(f"Server running at: {url}")
        print(f"Serving from: {os.getcwd()}")
        print("\nOpening browser...")
        print("Press Ctrl+C to stop the server\n")
        print("=" * 60)

        # Open browser
        webbrowser.open(url)

        # Start server
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 Server stopped")

if __name__ == "__main__":
    main()
