# Prism Server

This project is powered by [Express]. 

## Run the project

```cmd
git clone git@github.com:inorikiseki/prismx
cd prismx
npm start
```

## Construction

To generate the initial project, you should:  
1. Reference [Express Generator].  
2. Use IntelliJ IDEA Project Generating.   

## Debugging & Inspection

- Use tools like `curl`(Check [curl basics](./notes/curl_usage.md)) when your GUI is not set up to validate the connection and
service. 
> For instance, after your server is running:  
> 
> ```js
> router.get('/', function(req, res, next) {
>   res.render('index', { title: 'Express' });
> });
> ```
> For the above code:  
> ```cmd
> curl -X GET http://localhost:3000 // -X GET could be omitted for GET request.  
> curl -X GET http://localhost:3000 -o response.html // save response to file.  
> ```

[Express]:https://expressjs.com/en/starter/installing.html
[Express Generator]:https://expressjs.com/en/starter/generator.html
