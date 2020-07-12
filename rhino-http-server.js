// @ts-nocheck
const PrintWriter = java.io.PrintWriter;
const ServerSocket = java.net.ServerSocket;
const InputStreamReader = java.io.InputStreamReader;
const BufferedReader = java.io.BufferedReader;
exports.HttpServer = function() {
    function HttpServer() {
		this.server.listener = null;
		this.server.body = "";
		this.server.status = "200 OK";
		this.server.head["Keep-Alive"] = "timeout=5, max=100";
		this.server.head["Connection"] = "Keep-Alive";
		this.server.head["Content-Type"] = "text/html; charset=utf8";
    }
	HttpServer.prototype.init = function(port) {
		this.server.listener = ServerSocket(port);
		this.server.port = port; //사실은, 이거 장식임.
	};
	HttpServer.prototype.isRunning = false;
	HttpServer.prototype.start = function(listener) {
		HttpServer.prototype.isRunning = true;
		this.server.thread = java.lang.Thread(() -> {
			while(HttpServer.prototype.isRunning) {
				let sock = listener.accept();
				let reader = BufferedReader(InputStreamReader(socket.getInputStream()));
				let client = {};
				let line = reader.readLine();
				let s = line.split(" ");
				client["method"] = s[0];
				client["request_uri"] = s[1];
				delete s;
				client["HTTP Request"] = line;
				while ((line = reader.readLine()) != null)
				{
					let s = line.split(": ");
					let key = s[0];
					s.shift();
					let value = s.join(": ");
					delete s;
					client[key] = value;
				}
				listener(this, client);//client["Host"]이런식으로 접근
				let response = "HTTP/1.1 " + this.server.status + "\r\n";
				response += "Content-Length: " + this.server.body.length + "\r\n";
				Object.keys(this.server.head).forEach(key => {
					response += key + ": "+ this.server.head[key] + "\r\n";
				});
				response += "\r\n" + this.server.body
				PrintWriter(sock.getOutputStream(), true).println(response);
				sock.close();
			}
		});
		this.server.thread.start();
	};
	HttpServer.prototype.stop = function() {
		HttpServer.prototype.isRunning = false;
		this.server.thread.join();
	};
}