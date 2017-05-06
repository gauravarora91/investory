var functions = require('./functions');

var currentPage;

exports.getKnownUs = (req, res) => {

			currentPage = req.session.activePage = "/KnowUs";

			loginStatus = functions.checkLoginStatus(req);

			mobile = req.useragent["isMobile"];
			if (mobile)
				pageName = "knowUsMobile";
			else
				pageName = "knowUs";

			res.render(pageName, {
				user: req.user,
				selectorDisplay: "show",
				smessage: req.flash('signupMessage'),
				lmessage: req.flash('loginMessage'),
				loggedIn: loginStatus,
				footerDisplay: "show",
				footerData1: "Blog",
				footerData2: "FAQs"


			});
		};

exports.faqs = (req, res) => {

	currentPage = req.session.activePage = "/FAQs";
	loginStatus = functions.checkLoginStatus(req);
	mobile = req.useragent["isMobile"]
	if (mobile)
		pageName = "faqMobile";
	else
		pageName = "faqs";
	res.render(pageName, {
		selectorDisplay: "show",
		smessage: req.flash('signupMessage'),
		lmessage: req.flash('loginMessage'),
		loggedIn: loginStatus,
		user: req.user,
		footerDisplay: "show",
		footerData1: "Blog",
		footerData2: "FAQs"
	});
};
