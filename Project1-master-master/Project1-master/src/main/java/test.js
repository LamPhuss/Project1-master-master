var request = require('sync-request');
var fs = require('fs');
var configValues = JSON.parse(fs.readFileSync('UsersConfig.json'));
var graphAccessUrl = "https://login.microsoftonline.com/" + configValues.tenantId + "/oauth2/v2.0/token";
var graphTokenBody = "client_id=" + configValues.clientId + "&scope=" + configValues.scope + "&client_secret=" + configValues.clientSecretId + "&grant_type=client_credentials";
var contentType = "application/x-www-form-urlencoded; charset=utf-8";
var graphTokenError = "Failed to get graph token";
var graphToken = "";
//Call the get token method
getToken(graphAccessUrl, contentType, graphTokenBody, graphTokenError);
//This method is using to get the token from the graph token url and body
function getToken(url, type, content, errorMessage, callback) {
    var options = {
        'headers':
            {
                'Content-Type': type
            },
        'body': content
    };

    //Posting access parameters to the server
    var tokenResponse = httpPost(url, options);

    if (tokenResponse.statusCode === 200) {
        error = errorMessage;
        if (errorMessage === graphTokenError) {
            var token = JSON.parse(tokenResponse.body.toString('utf-8'));
            graphToken = token.access_token;
        }
        if (callback) {
            return callback();
        }
    } else {
        Console.log(errorMessage);
    }
}
var nextLink = "@odata.nextLink";
reqUrl = "https://graph.microsoft.com/V1.0/users?$top=999"
//call the get users method after you received the token in mail function
function getUsers(reqUrl) {
    try {
        var userList = [];
        console.log(MESSAGE + "Inside get users data method!!!");
//While condition is added to get more than 1000 users
        while(reqUrl)
        {
            var usersResponse = httpGet(reqUrl, graphToken);
            if (usersResponse.statusCode == 200) {
                failIndex = 0;
                var responseBlob = JSON.parse(usersResponse.body.toString('utf-8'));
                var parsedJsonres = responseBlob.value;
                userList = parsedJsonres;
                // add use case value to user collection [array]
                for (var i = 0; i < parsedJsonres.length; i++) {
                    var currItem = parsedJsonres[i];
                    if (currItem) {
                        bindUsers(currItem);
                    }
                }
//check whether the next link is available if so we have another set of users
                if (responseBlob[nextLink]) {
                    reqUrl=responseBlob[nextLink];
                    continue;
                }
                else {
                    console.log(MESSAGE + "There is no next page..")
                    break;
                }
            }
            else {
                if (usersResponse.statusCode === 401 && JSON.parse(usersResponse.body.toString('utf-8'))["error"]["message"] === "Access token has expired.") {
                    getToken(graphAccessUrl, contentType, graphTokenBody, graphTokenError);
                    userList = userDetails.concat(getUsers(responseBlob[nextLink]));
                }
                else {
                    failIndex++;
                    if (failIndex == retryCount) {
                        console.log(errorMessage + "User API Call has been failed..");
                        failIndex = 0;
                    }
                    else
                        userList = userDetails.concat(getUsers(responseBlob[nextLink]));
                }
            }
        }

    }
    catch (ex) {
        console.log(EXCEPTION_MESSAGE + ex);
    }
    return userList;
}
//Http method
function httpGet(url, bearerToken) {
    var request = require('sync-request');
    var res = request('GET', url,
        {
            'headers': {
                'Authorization': 'Bearer ' + bearerToken,
                'Accept': "application/json"
            }
        }
    );
    return res;
}