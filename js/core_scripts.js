/* 
 *                       Copyright (C) 2023, NORTHLIGHT System
 *                              All rights reserved.
 * 
 *                           Code Owner : Humanology Sdn Bhd
 * 
 *              This Code is solely used for NORTHLIGHT System Only. 
 *                     Any of the source code cannot be copied and/or 
 *      distributed without writen and/or verbal notice from the code owner as mentioned above.
 * 
 *                           Proprietory and Confidential  
 * 
 *            @version core_scripts.js 21 Nov 2023 Work
 *            @author  Work
 *            @since   21 Nov 2023
 * 
 * 
 *            MODIFIED
 *            Work     21 Nov 2023 - Creation
 * 
 * 
 * 
 */

/* 
 * Here comes the text of your license
 * Each line should be prefixed with  * 
 */
const TOKEN_KEY = "authToken";
const TOKEN_COOKIE = "X-AUTH-TOKEN"
const MIME_FORM = 'application/x-www-form-urlencoded; charset=UTF-8', MIME_JSON = 'application/json; charset=UTF-8';
const request = function (request)
{
    function isEmpty(value)
    {
        return (typeof (value) === "undefined" || value === "");
    }
    
    function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

    function init(request)
    {
        let headers = {};

        if (request.hasOwnProperty(TOKEN_KEY) && request[TOKEN_KEY] === true)
        {
            let token = session.get("X-AUTH-TOKEN",null);
            
            
           if (request.hasOwnProperty(TOKEN_KEY) && request[TOKEN_KEY] === true)
            {
                if(token === null)
                {
                    if (request.hasOwnProperty("fail"))
                            request.fail(xhr, textStatus, errorThrown);
                    else
                        alert("Token is not found. Plese login again")
                }
                else
                    headers[TOKEN_COOKIE] = token;
            }
            
            
            
        }

        if (request.hasOwnProperty("contentType"))
            headers["Content-Type"] = request["contentType"];
        else
            headers["Content-Type"] = MIME_FORM;

        if (request.hasOwnProperty('headers'))
            $.extend(headers, request.headers);

        request["baseUrl"] = request["baseUrl"].endsWith("/") ? request["baseUrl"] : request["baseUrl"] + "/";
        request["url"] = request["url"].startsWith("/") ? request["url"].substring(1, request["url"].length)  : request["url"];

        if(request["method"] === "GET" && request.hasOwnProperty("data"))
        {
            let data = request['data'];
            let params = new URLSearchParams();
            for(let key in data){
                if(!isEmpty(data[key]))
                    params.set(key, data[key]);
            }
            request["completeURL"] = request["baseUrl"] + request["url"] + "?" + params.toString();
        }

        else
            request["completeURL"] = request["baseUrl"] + request["url"];
        let attribute = {
            headers: headers,
            url: request["url"],
            baseUrl: request["baseUrl"].endsWith("/") ? request["baseUrl"] : request["baseUrl"] + "/",
            method: request.hasOwnProperty("method") ? request["method"] : "GET",
            cache: request.hasOwnProperty("cache") ? request["cache"] : "no-cache",
            mode: request.hasOwnProperty("mode") ? request["mode"] : "cors",
            data: request.hasOwnProperty("data") ? request["data"] : {},
            completeURL : request["completeURL"]
        };

        return attribute;
    }

    function send(request)
    {
        return new Promise(async function (resolve, reject)
        {
            var attribute = init(request);
            let result = {
                status: "",
                data: {},
                message: ""
            };
            
            await fetch(attribute["completeURL"], {
                method: attribute["method"],
                cache: attribute["cache"],
                headers: attribute["headers"],
                mode: "cors",
                body: attribute["method"] === "GET" ? null : JSON.stringify(attribute["data"])
            })
            .then(e => e.json())
            .then((response) => {
                if (response["statusCode"] === "OK")
                {
                    result["status"] = "ok";
                    result["data"] = response["entity"];
                    result["message"] = "";
                    
                    if (result.data.hasOwnProperty("token"))
                        session.set(TOKEN_COOKIE, result.data.token);
                } 
                else
                {
                    let messages = response.messages.globals;
                    let formattedMessage = "";
                    
                    for (var i = 0; i < messages.length; i++)
                    {
                        if (formattedMessage.length > 0)
                            formattedMessage += "<br/>";
                        formattedMessage += messages[i];
                    }
                    
                    messages = response.messages.fields;
                    
                    for (var i = 0; i < messages.length; i++)
                    {
                        if (formattedMessage.length > 0)
                            formattedMessage += "<br/>";
                        formattedMessage += messages[i].message;
                    }
                    
                    console.log("Formatted Message:" + formattedMessage);
                    result["status"] = "error";
                    result["data"] = {};
                    result["message"] = formattedMessage;
                }
            })
            .catch((error) => {
                console.error(error);
                result["status"] = "error";
                result["data"] = {};
                result["message"] = "Opps, unexpected error occurred. Please contact AURORA support if this issue persist.";
            })

            resolve(result);
        });
    }
    return {
        post: function (request)
        {
            request["method"] = 'POST';
            request["contentType"] = MIME_JSON;

            return send(request);
        },
        get: function (request)
        {
            request["method"] = 'GET';
            return send(request);
        }

    };
}();

const ajax = function (request)
{
    function isEmpty(value)
    {
        return (typeof (value) === "undefined");
    }

    function init(request)
    {
        let headers = {};
        let token = session.get(TOKEN_COOKIE, null);

        if (request.hasOwnProperty(TOKEN_KEY) && request[TOKEN_KEY] === true)
        {
            if(token === null)
            {
                if (request.hasOwnProperty("fail"))
                        request.fail(xhr, textStatus, errorThrown);
            }
        }
        else
                headers[TOKEN_COOKIE] = token;
        
        if (request.hasOwnProperty('headers'))
        {
            $.extend(headers, request.headers);
        }


        let attribute = {
            headers: headers,
            url: request["url"],
            baseUrl: request["baseUrl"].endsWith("/") ? request["baseUrl"] : request["baseUrl"] + "/",
            method: request.hasOwnProperty("method") ? request["method"] : "GET",
            cache: request.hasOwnProperty("cache") ? request["cache"] : "no-cache",
            mode: request.hasOwnProperty("mode") ? request["mode"] : "cors",
            data: request.hasOwnProperty("data") ? request["data"] : {},
            contentType: (request.hasOwnProperty("contentType") ? request.contentType : MIME_FORM)
        };

        return attribute;
    }

    function send(request)
    {
        return new Promise(function (resolve, reject)
        {
            var attribute = init(request);
            let result = {
                status: "",
                data: {},
                message: ""
            };

            $.ajax({
                url: attribute["baseUrl"] + attribute["url"],
                type: attribute["method"],
                async: (attribute.hasOwnProperty('async') ? attribute.async : true),
                headers: attribute["headers"],
                data: request["data"],
                contentType: attribute.contentType
            })
                    .done(function (data, textStatus, xhr)
                    {
                        if (data !== undefined && data !== null && data.hasOwnProperty("entity"))
                        {
                            let entity = data["entity"];

                            if (entity.hasOwnProperty("token"))
                            {
                                session.set(TOKEN_COOKIE, entity.token);
                            }
                        } else
                            console.log('no data')


                        resolve(data);

                    })
                    .fail(function (xhr, textStatus, errorThrown)
                    {
                        if (request.hasOwnProperty("fail"))
                            request.fail(xhr, textStatus, errorThrown);
                    });
        });
    }

    return {
        post: function (request)
        {
            request["method"] = 'POST';
            request["contentType"] = MIME_JSON;

            return send(request);
        },
        get: function (request)
        {
            request["method"] = 'GET';
            return send(request);
        }

    };
}();

const cookie = function (key, value)
{
    function isEmpty(value)
    {
        return (typeof (value) === "undefined");
    }
    function setExpiry(value)
    {
        return (new Date(Date.now() + (0.5 * 60 * 60 * 1000))).toUTCString();
    }
    function isString(value)
    {
        return (typeof (value) === 'string' || value instanceof String);
    }
    function serialize(value)
    {
        return value.replaceAll(",", "%44").replaceAll("\"", "'").replaceAll(" ", "%32").replaceAll("=", "%61")
    }

    function deserialize(value)
    {
        return value.replaceAll("%44", ",").replaceAll("'", "\"").replaceAll("%32", " ").replaceAll("%61", "=")
    }
    function check(cname)
    {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++)
        {
            let c = ca[i];
            while (c.charAt(0) == ' ')
            {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0)
            {
                return c.substring(name.length, c.length);
            }
        }
        return null;
    }

    return {
        set: function (key, value)
        {
            if (isEmpty(value) || isEmpty(key))
                return null;

            if (check(key) !== null)
                document.cookie = key + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;Secure;path=/;"

            document.cookie = key + "=" + serialize(value) + ";expires=" + setExpiry() + ";Secure;path=/;"
        },
        setJson: function (key, value)
        {
            if (isEmpty(value) || isEmpty(key))
                return null;

            document.cookie = key + "=" + serialize(JSON.stringify(value)) + ";expires=" + setExpiry() + ";Secure;path=/;"
        },
        get: function (key)
        {
            let x = document.cookie;

            if (isString(x))
            {
                let tmpArr = x.split(";");

                for (var i = 0; i < tmpArr.length; i++)
                {
                    let keyValue = tmpArr[i].trim().split("=");


                    if (keyValue[0] === key)
                        return deserialize(keyValue[1]);
                }

                return null;
            }

        }

    };
}();

const session = function (key, value)
{
    function isEmpty(value)
    {
        return (typeof (value) === "undefined");
    }

    function isString(value)
    {
        return (typeof (value) === 'string' || value instanceof String);
    }

    function serialize(value)
    {
        return JSON.stringify(value);
    }

    function deserialize(value)
    {
        if (value === null || !isString(value))
        {
            return undefined;
        }
        try
        {
            return JSON.parse(value);
        } catch (e)
        {
            return value || undefined;
        }
    }
    return {
        set: function (key, value)
        {
            if (isEmpty(value))
            {
                return sessionStorage.removeItem(key);
            }
            const serialized = serialize(value);
            sessionStorage.setItem(key, serialized);
            return serialized;
        },
        get: function (key, defaultValue)
        {
            const value = deserialize(sessionStorage.getItem(key));
            return (isEmpty(value) ? defaultValue : value);
        },
        getAndRemove: function (key)
        {
            const value = deserialize(sessionStorage.getItem(key));
            sessionStorage.removeItem(key);
            return value;
        },
        exists: function (key)
        {
            const value = sessionStorage.getItem(key);
            return (!isEmpty(value) && value !== null);
        },
        each: function (fn)
        {
            for (let i = 0, length = sessionStorage.length; i < length; i++)
            {
                const key = sessionStorage.key(i)
                fn(i, key, deserialize(sessionStorage.getItem(key)));
            }
        },
        remove: function (key)
        {
            if (Array.isArray(key))
            {
                key.forEach(function (e)
                {
                    sessionStorage.removeItem(e);
                });
            } else
            {
                sessionStorage.removeItem(key);
            }
        },
        clearAll: function ()
        {
            sessionStorage.clear();
        },
        getAll: function ()
        {
            const all = {}
            for (let i = 0, length = sessionStorage.length; i < length; i++)
            {
                const key = sessionStorage.key(i);
                all[key] = deserialize(sessionStorage.getItem(key));
            }
            return all;
        }
    };
}();

function logout(url) {
    request.post({
        baseUrl: url,
        url: "/API/AD/logout",
        data: {
            "entity" :{
                'userId': session.get("userid", ""),
            }
        }
    })
    
    session.clearAll();
    window.location.href = url +  '/infohub/index.jsp';

}

function serialiseMessage(messages)
{
    let formattedMsg = "";
    if (typeof (messages) === "object" && Array.isArray(messages))
    {
        for (var i = 0; i < messages.length; i++)
        {
            if (formattedMsg.length > 0)
                formattedMsg += " <br/>";

            formattedMsg += messages[i];
        }
    } else if (typeof (messages) === 'string')
    {
        formattedMsg = messages;
    }

    return formattedMsg;
}





