import mongoose,{Document, Model, Schema} from "mongoose";
import bcrypt from "bcryptjs";

const emailRegexPattern: RegExp = [-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\[[\t -Z^-~]*];

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar: {
        public_id : string;
        url: string;
    },
    role: string;
    isVerified: boolean;
    courses: Array<{courseId: string}>;
    comparePassword: (password: string) => Promise<boolean>;
};

const userSchema: Schema<IUser> = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please enter your name"],
    },
    email:{
        type: String,
        required: [true, "Please enter your email"],
        validate: {
            validator: function (value:string) {
                return emailRegexPattern.test(value);
            },
            message: "Please enter a valid email address"
        },
        unique: true;
    },
    password:{
        type: String,
        required: [true, "Please enter your password"],
        minlength: [8, "Password should be at least 8 characters long"],
        select: false,
    },
    avatar: {
        public_id: {type: String},
        url: {type: String}
    },
    role: {
       type: String,
       default: "user",
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    courses: [{
        courseId: String,
}],
},{timestamps:true});

// Hash password before saving
userSchema.pre<IUser>('save', async function(next) {
  if(!this.isModified('password')){
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();  
});


// compare password

userSchema.methods.comparePassword = async function(enteredPassword:string): Promise<boolean>{
    return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);
export default userModel;