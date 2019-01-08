# Visualizing microservices

## Background
When tasked with building a large online shopping system in the late 1990ies, we drew up sketches on whiteboards to try to find a way to scale by dynamically adding more nodes. Back then REST/API gateways/cloud computing was not really a thing, but now it is, and in the form/hype of microservices and all new projects try to avoid the “old outdated monolith approach”. 

And if you really have an application that requires you to go down this route (everyone wants to be the next Amazon or hyped game of course) you’ll quickly find that microservices mean very different things to different people. There are open-source tools as well as big expensive enterprise platforms. 

No matter how outdated the whiteboard is, it is still a valid way to communicate the overall idea and explain how the pieces make up the puzzle that is your new ground-breaking project. And this can even be a way to collaborate from the beginning and introduce more people to your project. But as it grows, and when others want to understand your service – may it be auditors, investors or business partners – you’ll need that nice PDF that “explains it all”.

At this point most of us turn to Visio or some other tool to produce said PDF. And you succeed and move on, hire more staff, the project and service grow and that PDF that you created manually becomes more and more obsolete over time. Why? Because it’s very distant from where the action is – in the source code. 

Having seen this and wanting to avoid it in a couple of projects we are working now at John Doe Invest, we started to look for solutions. Surely, there must be something? There are tools for everything and while some great tools are harder to find than others (as we are using Kafka and Avro schemas in many projects, this project was also in part inspired by the great tools provided by Landoop https://github.com/Landoop/schema-registry-ui) it should be possible to find right?

After some Googling, one of the best attempts found was "A Better Way of Visualizing Microservice Architecture" https://articles.microservices.com/an-alternative-way-of-visualizing-microservice-architecture-837cbee575c1 which contains an image that says it all. However, this confirmed the basic idea and someone else was thinking along the same track: if we can generate the documentation from something that can be maintained by whoever is coding… 

In fact, we could take it one step further and have parts of the descriptive file generate or control the code/execution so that it’s impossible to make some changes without updating the description first…

## Goals
The projects we work on at the time of writing this are Node.js based so the examples and supporting implementations here will be JS based. Now, the goal here is not to become a language/platform specific tool. 
The Goal is to create a description format that can be used for any language/platform to describe a microservice and then visualize it with this tool.

It’s an open-source project so feel free to branch, copy, do whatever – but we kind of hope to see interest in contributing to this project to create a solution that can deal with many languages/platforms/use-cases etc. since that will always benefit the most people.

The initial work is funded by John Doe Invest Ltd and given that we see interest in the project and that we continue to use it internally for our growing list of projects, we’ll continue to sponsor it through development resources.

## Example serviceDescription.json file
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

### Sample url to load in the client
CHANGE ME!
https://raw.githubusercontent.com/lamdoann/serviceDescriptions/master/serviceDescription-0.json

### Sample GitHub to serach in the client
TODO!

