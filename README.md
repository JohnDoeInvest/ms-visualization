# ms-visualization
A tool that generates a visual representation of a microservice from a JSON file.

The project was inspired by https://articles.microservices.com/an-alternative-way-of-visualizing-microservice-architecture-837cbee575c1

### Import JSON data and modify on it
```
{
    "name": "authenticate-bankid",
    "description": "Accepts a Swedish social security number (SSID) and interfaces with the BankID service",
    "envVars": [],
    "restAPI": [
      {
        "uri": "/movies",
        "method": "POST",
        "parameters": {
          "ssid": "string with Swedish social security number"
        }
      }
    ],
    "sharedServices": [
        { "name": "redis" }
    ],
    "produces": [
        {
            "name": "kafka",
            "topics": ["clientrequests", "authenticate-bankid"]
        }
    ],
    "consumes": [
        {
            "name": "kafka",
            "topics": ["clientrequests", "authenticate-bankid"]
        }
    ],
    "stores": [
        {
            "name": "sqllite",
            "dbs": [
                {
                    "name": "authenticate-bankid",
                    "tables": ["authenticate-bankid"]
                }
            ]
        }
    ]
}
``` 

### Load file
Sample json url: https://raw.githubusercontent.com/lamdoann/serviceDescriptions/master/serviceDescription-0.json

