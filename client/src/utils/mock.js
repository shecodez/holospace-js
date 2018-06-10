export const messages = [
	{
		id: "m1",
		body: "Hi there! :)emoj",
		author: "Niico",
		user_id: "u1",
		channel_id: "c1",
		created_at: Date.now()
	},
	{
		id: "m2",
		body:
			"My name is Nicole J. Nobles and I'm a designer and developer from Georgia.",
		author: "Niico",
		user_id: "u1",
		channel_id: "c1",
		created_at: Date.now()
	},
	{
		id: "m3",
		body: "~image url of contact info~",
		author: "Niico",
		user_id: "u1",
		channel_id: "c1",
		created_at: Date.now()
	},
	{
		id: "m4",
		body:
			"I graduated from Georgia College & State University in 2014 with a Bs. in Comp Sci. (3.8/4.0)",
		author: "Niico",
		user_id: "u1",
		channel_id: "c2",
		created_at: Date.now()
	},
	{
		id: "m5",
		body:
			"From 2015 to now I've worked for microNovations llc as a contracted web designer and IT Tech",
		author: "Niico",
		user_id: "u1",
		channel_id: "c3",
		created_at: Date.now()
	},
	{
		id: "m6",
		body:
			"My latest hobby project HoloSpace is my attempt to break into the VR world. It uses React/Redux and PlayCanvas on the frontend with Node/Express, MongoDB and SocketIO on the backend. I know I still have a way to go on it, but I'm learning a lot and having a blast hacking it together.",
		author: "Niico",
		user_id: "u1",
		channel_id: "c3",
		created_at: Date.now()
	},
	{
		id: "m7",
		body:
			"My Skills include: Full stack development with MEAN, MERN, Rails, HTML5/CSS3/JS, Languages: Java & C++ with a dash of Python, and CSS Frameworks: Bootstrap, Semantic, Material, and AntDesign",
		author: "Niico",
		user_id: "u1",
		channel_id: "c1",
		created_at: Date.now(),
		updated_at: Date.now()
	},
	{
		id: "m8",
		body:
			"I built HoloSpace2 as test ground for HoloSpace but thought why not also use it as a showcase, an 'interactive' resume if you will, that will hopefully help me stand out from the crowd and land me the job I'm aiming.",
		author: "Niico",
		user_id: "u1",
		channel_id: "c1",
		created_at: Date.now()
	}
];

export const members = [
	{ id: "u1", username: "Niico", online: true },
	{ id: "u2", username: "龍ハヤブサ", online: true },
	{ id: "u3", username: "Kai", online: true, status: "hide" },
	{ id: "u4", username: "WillIAm", online: true },
	{ id: "u5", username: "山田太郎", online: false },
	{ id: "u6", username: "홍길동", online: true },
	{ id: "u7", username: "IronMan", online: false }
];

export const friends = [
	{ id: "u2", username: "龍ハヤブサ", online: true },
	{ id: "u3", username: "Kai", online: true, status: "hide" }
];

export const servers = [
	{ id: "s1", name: "Resume | NJN" },
	{ id: "s2", name: "이거 매워요?" },
	{ id: "s3", name: "見ぬが花" }
];

export const channels = [
	{ id: "c1", server_id: "s1", name: "general", type: "TEXT" },
	{ id: "c2", server_id: "s1", name: "Education", type: "TEXT" },
	{ id: "c3", server_id: "s1", name: "Experience", type: "TEXT" },
	{ id: "c4", server_id: "s1", name: "The Voice", type: "VOIP" },
	{ id: "c5", server_id: "s1", name: "Holodeck 18", type: "HOLO" }
];

export const presence = {
	c4: {
		id: "p1",
		channel_id: "c4",
		users: [{ id: "u4", username: "WillIAm" }]
	},
	c5: {
		id: "p2",
		channel_id: "c5",
		users: [
			{ id: "u2", username: "龍ハヤブサ" },
			{ id: "u6", username: "홍길동" }
		]
	}
};
