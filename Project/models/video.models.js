import mongoose from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
const VideoSchema = new mongoose.Schema({
    videoFile:{
        type:String, // cloudatry url
        required: true,
    },
    thumbnail:{
        type:String,
        required: true,
    },
    title:{
        type:String,
        required: true,
    },
    description:{
        type:String,
        required: true,
    },
    duration:{
        type: Number, //  cloudary
        required: true,
    },
    views:{
        type: Number, 
        defualt: 0,
    },
    public:{
        type: Boolean,
        default: true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref : "user"
    }
},{timestamps:true})

VideoSchema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model("Video",VideoSchema);