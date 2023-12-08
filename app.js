const express = require("express");
const router = express.Router();
var url = require("url");
var proxy = require("express-http-proxy");
var app = express();
var path = require("path");
let cookie_parser = require("cookie-parser");
var fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });


require("dotenv").config();

app.use(express.json());

app.use(cookie_parser());

app.use(express.urlencoded({ extended: true }));

app.use(express.static("build"));

async function callAPI(token) {
  console.log("Inside access Token call");
  const response = await fetch("http://localhost:8091/generate/accessToken", {
    method: "POST",
    body: JSON.stringify({ token: token }),
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();
  console.log("API call Done");
  return data;
}

var checkAuthorizationToken = function (req, res, next) {
  var token = req.cookies.token;
  var refresh_token = req.cookies.refresh_token;

  jwt.verify(
    token,
    process.env.SECRET,
    process.env.ALGORITHM,
    async function (err, decoded) {
      if (err) {
        if (err.name && err.name == "TokenExpiredError") {
          //call create token API
          console.log("calling token extension API ...." + refresh_token);
          let genToken = await callAPI(refresh_token);
          console.log("API Call complete ...." + JSON.stringify(genToken));
          if (genToken.token && genToken.refresh) {
            token = genToken.token;
            res.cookie("token", genToken.token, {
              httpOnly: true,
            });
            res.cookie("refresh_token", genToken.refresh, {
              httpOnly: true,
            });
            req.headers["Authorization"] = "Bearer " + token;
            next();
          } else if (genToken.detail) {
            console.log("here");
            res.clearCookie("token");
            res.clearCookie("refresh_token");
            res.sendStatus(403);
            return;
          }
        }
      } else {
        console.log("token working from previous one");
        req.headers["Authorization"] = "Bearer " + token;
        next();
      }
    }
  );
};

var PROXY_URL = "localhost:8091";

app.use(
  "/api/filter/recipe",
  proxy(PROXY_URL, {
    proxyReqPathResolver: function (req, res) {
      var parts = req.url.split("?");
      var QUERY_STRING = parts[1];
      var PATH = req.baseUrl.replace("/api", "");
      var UPDATED_PATH = PATH + (QUERY_STRING ? "?" + QUERY_STRING : "");
      return UPDATED_PATH;
    },
  })
);

app.use(
  "/api/filter/recipe",
  proxy(PROXY_URL, {
    proxyReqPathResolver: function (req, res) {
      var parts = req.url.split("?");
      var QUERY_STRING = parts[1];
      var PATH = req.baseUrl.replace("/api", "");
      var UPDATED_PATH = PATH + (QUERY_STRING ? "?" + QUERY_STRING : "");
      return UPDATED_PATH;
    },
  })
);

app.use(
  "/api/fetch/complete/recipe",
  proxy(PROXY_URL, {
    proxyReqPathResolver: function (req, res) {
      var parts = req.url.split("?");
      var QUERY_STRING = parts[1];
      var PATH = req.baseUrl.replace("/api", "");
      var UPDATED_PATH = PATH + (QUERY_STRING ? "?" + QUERY_STRING : "");
      return UPDATED_PATH;
    },
  })
);

app.use(
  "/api/search/cookspire",
  proxy(PROXY_URL, {
    proxyReqPathResolver: function (req, res) {
      var parts = req.url.split("?");
      var QUERY_STRING = parts[1];
      var PATH = req.baseUrl.replace("/api", "");
      var UPDATED_PATH = PATH + (QUERY_STRING ? "?" + QUERY_STRING : "");
      return UPDATED_PATH;
    },
  })
);

app.use(
  "/api/persist/user",
  proxy(PROXY_URL, {
    proxyReqPathResolver: function (req, res) {
      var parts = req.url.split("?");
      var QUERY_STRING = parts[1];
      var PATH = req.baseUrl.replace("/api", "");
      var UPDATED_PATH = PATH + (QUERY_STRING ? "?" + QUERY_STRING : "");
      return UPDATED_PATH;
    },
  })
);

app.use(
  "/api/fetch/recipe/cuisine",
  proxy(PROXY_URL, {
    proxyReqPathResolver: function (req, res) {
      var parts = req.url.split("?");
      var QUERY_STRING = parts[1];
      var PATH = req.baseUrl.replace("/api", "");
      var UPDATED_PATH = PATH + (QUERY_STRING ? "?" + QUERY_STRING : "");
      return UPDATED_PATH;
    },
  })
);

app.use(
  "/api/fetchAll/trending/post/",
  proxy(PROXY_URL, {
    proxyReqPathResolver: function (req, res) {
      var parts = req.url.split("?");
      var QUERY_STRING = parts[1];
      var PATH = req.baseUrl.replace("/api", "");
      var UPDATED_PATH = PATH + (QUERY_STRING ? "?" + QUERY_STRING : "");
      return UPDATED_PATH;
    },
  })
);

app.use(
  "/api/search/recipe",
  proxy(PROXY_URL, {
    proxyReqPathResolver: function (req, res) {
      var parts = req.url.split("?");
      var QUERY_STRING = parts[1];
      var PATH = req.baseUrl.replace("/api", "");
      var UPDATED_PATH = PATH + (QUERY_STRING ? "?" + QUERY_STRING : "");
      return UPDATED_PATH;
    },
  })
);

app.use(
  "/api/search/cookspire",
  proxy(PROXY_URL, {
    proxyReqPathResolver: function (req, res) {
      var parts = req.url.split("?");
      var QUERY_STRING = parts[1];
      var PATH = req.baseUrl.replace("/api", "");
      var UPDATED_PATH = PATH + (QUERY_STRING ? "?" + QUERY_STRING : "");
      return UPDATED_PATH;
    },
  })
);

app.use(
  "/api/fetch/trending/profile",
  proxy(PROXY_URL, {
    proxyReqPathResolver: function (req, res) {
      var parts = req.url.split("?");
      var QUERY_STRING = parts[1];
      var PATH = req.baseUrl.replace("/api", "");
      var UPDATED_PATH = PATH + (QUERY_STRING ? "?" + QUERY_STRING : "");
      return UPDATED_PATH;
    },
  })
);

app.use(
  "/api/verify/user",
  proxy(PROXY_URL, {
    proxyReqPathResolver: function (req, res) {
      var parts = req.url.split("?");
      var QUERY_STRING = parts[1];
      var PATH = req.baseUrl.replace("/api", "");
      var UPDATED_PATH = PATH + (QUERY_STRING ? "?" + QUERY_STRING : "");
      return UPDATED_PATH;
    },
    userResDecorator: function (proxyRes, proxyResData, userReq, userRes) {
      data = JSON.parse(proxyResData.toString("utf8"));
      userRes.cookie("token", data.accessToken, {
        httpOnly: true,
      });
      userRes.cookie("refresh_token", data.refresh, {
        httpOnly: true,
      });
      return JSON.stringify(data);
    },
  })
);

app.use(
  "/api/*",
  checkAuthorizationToken,
  proxy(PROXY_URL, {
    proxyReqPathResolver: function (req, res) {
      var parts = req.url.split("?");
      var QUERY_STRING = parts[1];
      var PATH = req.baseUrl.replace("/api", "");
      var UPDATED_PATH = PATH + (QUERY_STRING ? "?" + QUERY_STRING : "");
      return UPDATED_PATH;
    },
  })
);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use(router);

const PORT = 5000;
app.listen(PORT, () => {
  console.log("Notes App started on PORT: " + PORT);
});
