export const port = process.env.PORT || 3000;
export const host = process.env.HOST || "localhost";

export const uri = `http://${host}:${port}`;

export const messageTypes = [
	"message:send",
	"message:recv",

	"user:typing",
	"stop:typing",

	"user:init",
	"user:update",
	"clients:update",

	"channel:join",
	"channel:switch",
	"channel:left",
	
	"voip:send",
	"voip:recv",

	"player:init",
	"player:data",
	"player:joined",
	"client:disconnected",
	"move:player",
	"turn:player",	
	"position:update",
	"rotation:update",
	"player:exit"
].reduce((accum, msg) => {
	accum[msg] = msg;
	return accum;
}, {});
