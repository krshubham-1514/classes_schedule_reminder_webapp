const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const classSchema=new Schema({
    className: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    day: {
        type: String,
        required: true
    },
    link:{
        type: String,
        default:' '
    }

    
})

module.exports=mongoose.model('class',classSchema)