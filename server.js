const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const path = require('path');
const uuid = require('uuid');

const app = new Koa();

const subscriptions = [];

let data = [
    {
        id: "1",
        name: 'Поменять краску в принтере',
        description: 'Поменять краску в принтере, Поменять краску в принтере',
        status: false,
        created: '10.03.23'
    },
    {
        id: "2",
        name: 'Поменять краску в принтере 2',
        description: 'Поменять краску в принтере, Поменять краску в принтере',
        status: true,
        created: '10.03.23'
    },
    {
        id: "3",
        name: 'Поменять краску в принтере 3',
        description: 'Поменять краску в принтере, Поменять краску в принтере',
        status: false,
        created: '15.03.23'
    }
];

const public = path.join(__dirname, '/public');

app.use(koaBody({
    urlencoded: true,
    multipart: true,
}))


app.use((ctx, next) => {
    if (ctx.request.method !== 'OPTIONS') {
        next();
        return;
    }
    ctx.response.set('Access-Control-Allow-Origin', '*');
    ctx.response.set('Access-Control-Allow-Methods', 'DELETE, PUT, PATCH, GET, POST');
    ctx.response.status = 204;

});

app.use((ctx, next) => {
    if (ctx.request.method !== 'DELETE') {
      next();
  
      return;
    }  
    const id = ctx.request.query.id;    
  
    ctx.response.set('Access-Control-Allow-Origin', '*');    
  
    if (data.every(ticket => ticket.id !== id)) {
      ctx.response.status = 400;
      ctx.response.body = 'doesn\'t exists';
  
      return;
    }
    data = data.filter(ticket => ticket.id !== id);

    ctx.response.body = data;
  
    next();
});

app.use((ctx, next) => {
    if (ctx.request.method !== 'POST') {
      next();
  
      return;
    }
  
    ctx.response.set('Access-Control-Allow-Origin', '*');
    const req = JSON.parse(JSON.parse(ctx.request.body));
    console.log(req.id);
    if (data.some(ticket => ticket.id === req.id)) {
        data.forEach(ticket => {
            if (ticket.id == req.id) {
                ticket.name = req.name;
                ticket.description = req.description;
                ticket.status = req.status;
            }
        });
    } else {
        const date = new Date();
        const curDate = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
        const newTicket = {
            id: uuid.v4(),
            name: req.name,
            description: req.description,
            status: false,
            created: curDate
        } 
        
        data.push(newTicket);
    }
    
  
    ctx.response.body = data; 
});

app.use((ctx, next) => {
    if (ctx.request.method !== 'GET') {
      next();
  
      return;
    }
    
    //console.log(ctx.request.body);  
      
    ctx.response.set('Access-Control-Allow-Origin', '*');

    ctx.response.status = 400;

    ctx.response.body = data;
  
    next();
});


/* const server = http.createServer((req,res) => {
    const buff = [];

    req.on('data', (chunk) => {
        buff.push(chunk);
    })

    req.on('end', () => {
        const data = Buffer.concat(buff).toString();

        console.log(data);
    })

    res.end('server response');
}); */

const server = http.createServer(app.callback());

const port = 5050;

server.listen(port, (err) => {
    if (err) {
        console.log(err);

        return;
    }

    console.log('server is listening to ' + port);
});