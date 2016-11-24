define({ "api": [
  {
    "type": "get",
    "url": "/nationality_query/:id",
    "title": "Query Nationalities List",
    "version": "1.0.0",
    "name": "QueryNationality",
    "group": "Utils",
    "permission": [
      {
        "name": "none"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "nationality",
            "description": "<p>Target nationality</p>"
          }
        ]
      }
    },
    "description": "<p>Query for nationalities list or filter by parsed parameters. The method expects that you also specify the feedback format by specifying the path attribute <code>:id</code> which can either be <code>json</code> for JSON return values or <code>html</code> for HTML return code type.</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response (:id == json):",
          "content": "HTTP/1.1 200 OK\n{\n  [\"Nationality 1\",...]\n}",
          "type": "json"
        },
        {
          "title": "Success-Response (:id == html):",
          "content": "HTTP/1.1 200 OK\n{\n  \"&lt;li&gt;Nationality 1&lt;/li&gt;...\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./app.js",
    "groupTitle": "Utils"
  },
  {
    "type": "get",
    "url": "/nationality_query/:id",
    "title": "Query Nationalities List",
    "version": "1.0.0",
    "name": "QueryNationality",
    "group": "Utils",
    "permission": [
      {
        "name": "none"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "nationality",
            "description": "<p>Target nationality</p>"
          }
        ]
      }
    },
    "description": "<p>Query for nationalities list or filter by parsed parameters. The method expects that you also specify the feedback format by specifying the path attribute <code>:id</code> which can either be <code>json</code> for JSON return values or <code>html</code> for HTML return code type.</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response (:id == json):",
          "content": "HTTP/1.1 200 OK\n{\n  [\"Nationality 1\",...]\n}",
          "type": "json"
        },
        {
          "title": "Success-Response (:id == html):",
          "content": "HTTP/1.1 200 OK\n{\n  \"&lt;li&gt;Nationality 1&lt;/li&gt;...\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./public/modules/app.js",
    "groupTitle": "Utils"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./doc/main.js",
    "group": "_home_chimwemwe_projects_work_apps_architecture_htc_doc_main_js",
    "groupTitle": "_home_chimwemwe_projects_work_apps_architecture_htc_doc_main_js",
    "name": ""
  }
] });
