const express=require('express');
const mongoose=require('mongoose');
const nodemailer=require('nodemailer');
const morgan=require('morgan');
const ClassSchema=require('./models/Class');
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:process.env.EMAIL_USERNAME ,
        pass:process.env.EMAIL_PASSWORD
    }
});


const PORT=process.env.PORT||3000;
const app=express();

app.set('view engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({ extended:false }));
app.use(morgan('dev'));

const url=process.env.Mongodb_URL;
const connect=mongoose.connect(url,{ 
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useUnifiedTopology: true
});

connect.then((db)=>{
    console.log('Connected to mongodb server');
}).catch((err)=>{
    console.log('Something went wrong',err);
})



app.get('/',(req,res) => {
    ClassSchema.find({}).then((response)=>{
        ClassSchema.find({}).then((response)=>{
            res.render('index',{data:response});
        }).catch((error) => {
            res.status(404).json({ error: error})
        })
        
    })
    
})
app.post('/api/add_new_class',(req,res) => {
    console.log(req.body);
    const new_class={
        className: req.body.class_name,
        startTime:req.body.start_time,
        endTime:req.body.end_time,
        day:req.body.day,
        link:req.body.class_meeting_link

    }
    ClassSchema.create(new_class).then((response) => {
        res.status(200).json(response);
    }).catch((error) => {
        res.status(404).json({ error: error})
    })
    
})

app.delete('/api/delete_class',(req,res) => {
    
    ClassSchema.findByIdAndRemove(req.query.id).then((res) => {
        console.log(res);

    }).catch(err => {console.log(err);})
})

const check_time=async()=>{

    let date=new Date();
    let server_day=date.getDay(); 
    let options = { hour12: false };
    let datetime=date.toLocaleString('en-US', options).split(',')[1].split(':')[0];
    
    if(7<=parseInt(datetime) && parseInt(datetime)<=8)
    {
        ClassSchema.find({day:server_day}).then(async(response)=>{
        
            let mail_html="</div><br><h3>Hello Shubham Kumar,</h3><p>Here is your Today Classes Schedule</p></div><div><table style='border: 1px solid #333;padding:10px;'>";
            mail_html+="<thead style='background-color: #ededed;'><th>Class</th><th>Start Time</th><th>EndTime</th><th>Class Meeting Link</th></thead>";
            response.map((listitem)=>{
                mail_html+="<tr style='padding:10px;'><td>"+listitem.className+"</td><td>"+listitem.startTime+"</td><td>"+listitem.endTime+"</td><td><a href='"+listitem.link+"'>Join Class</a></td></tr><br>";
    
            })
            mail_html+='</table></div>';
            let info = await transporter.sendMail({
                from: '"Shubham Kumar" <krshubham.work@gmail.com>', // sender address
                to: "krshubham1514@gmail.com", // list of receivers
                subject: "Today Classes Schedule ", // Subject line
                html: mail_html, // html body
            });
        }).catch((error)=>{
            console.log(error);
            throw new Error('Something went wrong')
        })

    }
    
    

}

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
    setInterval(check_time, 1000 * 60 * 60);
})


