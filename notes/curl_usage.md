# `curl` Guide: Basic HTTP Requests

`curl` is a command-line tool for transferring data with URLs.  
This guide covers basic HTTP requests using `curl`.

## Table of Contents

1. [GET Request](#get-request)
2. [POST Request](#post-request)
3. [PUT Request](#put-request)
4. [DELETE Request](#delete-request)
5. [Adding Headers](#adding-headers)
6. [Sending Data](#sending-data)
7. [Handling Responses](#handling-responses)

## Basic Requests

### GET Request

Fetches data from the specified URL.

```sh
curl https://api.example.com/resource
```

### POST Request

Sends data to the specified URL to create a resource.

```sh
curl -X POST https://api.example.com/resource -d "param1=value1&param2=value2"
```

### PUT Request

Updates an existing resource.

```sh
curl -X PUT https://api.example.com/resource/123 -d "param1=value1&param2=value2"
```

### DELETE Request

Deletes a resource.

```sh
curl -X DELETE https://api.example.com/resource/123
```

## Additional Options

### Adding Headers

Include custom headers in your request.

```sh
curl -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" https://api.example.com/resource
```

### Sending Data

Send data in various formats (e.g., URL-encoded, JSON).

#### URL-encoded Data

```sh
curl -X POST https://api.example.com/resource -d "param1=value1&param2=value2"
```

#### JSON Data

```sh
curl -X POST https://api.example.com/resource -H "Content-Type: application/json" -d '{"param1":"value1","param2":"value2"}'
```

### Handling Responses

Save the response to a file or display it in the terminal.

#### Save to File

```sh
curl https://api.example.com/resource -o response.json
```

#### Display Response Headers

```sh
curl -I https://api.example.com/resource
```

## Example Use Cases

### Example 1: GET Request with Headers

```sh
curl -H "Accept: application/json" https://api.example.com/resource
```

### Example 2: POST JSON Data with Authorization

```sh
curl -X POST https://api.example.com/resource -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" -d '{"param1":"value1","param2":"value2"}'
```

### Example 3: PUT Request with URL-encoded Data

```sh
curl -X PUT https://api.example.com/resource/123 -d "param1=value1&param2=value2"
```

### Example 4: DELETE Request with Headers

```sh
curl -X DELETE https://api.example.com/resource/123 -H "Authorization: Bearer YOUR_TOKEN"
```

---

This concise guide provides a quick reference for using `curl` to perform common HTTP requests, including how to add headers, send data, and handle responses.
