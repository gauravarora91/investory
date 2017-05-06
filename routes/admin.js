var express = require('express');
var router = express.Router();
var async = require('async');
var path=require('path');
var pg = require('pg');
var conString = process.env.DATABASE_URL ||  "postgres://postgres:postgres@localhost:5432/investory";
//var conString = process.env.DATABASE_URL ||  "postgres://user1:12345@localhost:5432/investorydb";
/*var conString = {
  user: 'user1', //env var: PGUSER
  database: 'investory', //env var: PGDATABASE
  password: '12345', //env var: PGPASSWORD
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: -1, // max number of clients in the pool
  idleTimeoutMillis: 5000, // how long a client is allowed to remain idle before being closed
};*/


var client = new pg.Client(conString);
client.connect();
var dbOperations = require("../dbOperations.js");

var multer  =   require('multer');

var fs = require('node-fs');



var storage =   multer.diskStorage({    
destination: function (req, file, callback) 
{
    if(pan)
      {
        var name = '/home/ubuntu/panuploads/'+pan; //location for directory to store documents 
        fs.mkdir(name, 0777, true, function (err) 
        {
          if (err) 
            {
              console.log(err);
            } 
          else
            {
              console.log('name ' + name + ' created.');
            }
          callback(null, name);
        });
      }
},
filename : function (req, file, callback) 
{
   if(file.originalname=='address_proof'+ path.extname(file.originalname))
   {
     console.log("addressproof");
     var val1='addressproof';
     var val2="uploaded";
     updatedoc(id,val1,val2);
     callback(null, file.originalname/*feildname originalname+ '-' + Date.now()*/);
    } 
    if(file.originalname=='id_proof'+ path.extname(file.originalname))
    {
      console.log("idproof");
      var val1="idproof";
      var val2="uploaded"
      updatedoc(id,val1,val2);   
      callback(null, file.originalname/*feildname originalname+ '-' + Date.now()*/);
     }
    if(file.originalname=='signature_proof'+ path.extname(file.originalname))
    {
      console.log("signatureproof");
      var val1="signatureproof";
      var val2="uploaded"
      updatedoc(id,val1,val2);     
      callback(null, file.originalname/*feildname originalname+ '-' + Date.now()*/);
       }
  if(file.originalname=='kyc_video'+ path.extname(file.originalname))
    {
      console.log("kycvideo");    
      var val1="kycvideo";
      var val2="uploaded"
      updatedoc(id,val1,val2);
      callback(null, file.originalname/*feildname originalname+ '-' + Date.now()*/);
     } 
    if(file.originalname=='bse_application'+ path.extname(file.originalname))
    {
      console.log("bseapplication");    
      var val1="bsestarapplication";
      var val2="uploaded"
      updatedoc(id,val1,val2);
      callback(null, file.originalname/*feildname originalname+ '-' + Date.now()*/);
     }
    
     if(file.originalname=='statutory_form'+ path.extname(file.originalname))
    {
      console.log("statutory_form");    
      var val1="statutoryform";
      var val2="uploaded"
      updatedoc(id,val1,val2);
      callback(null, file.originalname/*feildname originalname+ '-' + Date.now()*/);
     } 
      if(file.originalname=='nach_form'+ path.extname(file.originalname))
    {
      console.log("nach_form");    
      var val1="nachform";
      var val2="uploaded"
      updatedoc(id,val1,val2);
      callback(null, file.originalname/*feildname originalname+ '-' + Date.now()*/);
     } 
  }
});
//upload documents function
var upload = multer({ storage : storage}).array('doc',7);


//upload csv
//kyc documents upload router
router.post('/api/doc',function(req,res)
{   
   //console.log("pan ",+pan); 
   upload(req,res,function(err) 
   {
     if(err) 
       {
          console.log(err);
          console.log("Error uploading file.");
        }
      console.log("File is uploaded");
    });
   res.render("Admin/tables");
});
/* GET home page. */
router.get('/', function(req, res, next)
{
    res.render('Admin/login', { title: 'Express' });
});
router.get('/login', function(req, res, next)
{
    res.render('Admin/login', { title: 'Express' });
});

// dispalys user details kyc pending from user and pan_details tables
router.get('/tables',function(req,res,next)
{    
    console.log("Hi..");
   res.render("Admin/tables");
});
router.get('/index',function(req,res,next)
{    
    
   res.render("Admin/index",{
       users : req.user
   });
});


//gets kyc pending records 
router.get('/tables/get',function(req,res)
{
     
console.log("kyc");
  dbOperations.getRecords(req,res);      
    
});

//updates the kyc status as selected and saves changes
router.get('/saveChanges',function(req,res,next)
{
    
              dbOperations.updateRecord(req,res);
             
            res.redirect('Admin/tables');
    
});

//get id of row and makes it as global to all routers
var pan,id;
router.get('/saveId',function(req,res,next)
{
    console.log("pan ",+req.query.pan);
    pan=req.query.pan;
    id=req.query.id;
    console.log("id ",+req.query.id);
});


/*
router.get('/tables/changeStatus',function(req,res,next)
{
    dbOperations.insertinto();
              
           res.redirect('/tables');
    
});*/

//reconcile page to render page 
router.get('/reconcile',function(req,res){
   
    res.render("Admin/reconcile");
});

//get reconcile records 
router.get('/reconcile/get',function(req,res)
{
    dbOperations.insertinto();
    console.log("reconcile");
    dbOperations.getReconcileRecords(req,res);
    
   
});
router.get('/failedorders',function(req,res)
{
    
     res.render("Admin/failedOrders");
   
});
router.get('/failedorders/get',function(req,res)
{
    
    console.log("failedorders");
    dbOperations.failedOrders(req,res);
    
   
});

//update nav,txnreference,units into userinvestmentorders table from dumplog
router.get('/getDumpUpdates',function(req,res)
{
    var ids=req.query.id;
    dbOperations.getReconciledDumpUpdates(req,res,ids);
    res.redirect("Admin/reconcile"); 
});


//sets status as in userinvestmentorders table
router.get('/setReconcileAsStatus',function(req,res)
{
    console.log("Hi update reconcile");
    var ids=req.query.id;
    dbOperations.updateStatusAsReconcile(req,res,ids);
    res.redirect("Admin/reconcile"); 
});


router.get('/blank-page',function(req,res,next)
{
    res.render('Admin/blank-page');
});

router.get('/bootstrap-grid',function(req,res,next)
{
    res.render('Admin/bootstrap-grid');
});

router.get('/reports',function(req,res,next)
{
    res.render('Admin/reports');
});

router.get('/index-rtl',function(req,res,next)
{
    res.render('Admin/index-rtl');
});

router.get('/uploadcsv',function(req,res,next)
{
res.render('Admin/uploadcsv');
});

//upload files to dumplog
var store =   multer.diskStorage({    
                destination: function (req, file, callback) 
                    {

        				callback(null,'/home/ubuntu/dbfiles');
                        //callback(null, '../dbfiles');

      
                     },
                 filename : function (req, file, callback) 
                    {
                        
                        callback(null, file.originalname/*feildname originalname+ '-' + Date.now()*/);
                    }

                    });
                var uploaddb = multer({ storage : store}).single('doc');

            

router.post('/uploadcamsfile',function(req,res,next)
{
    console.log("upload csv to Db");
    var tbl="camstrxnlog";
     var file_name;
    async.waterfall([
      function(callback)
        {
            uploaddb(req,res,function(err) 
                {
                    if(err) 
                    {
                     console.log(err);
                     console.log("Error uploading file.");
                    }
                  console.log("File is uploaded");
                
                    file_name=req.file.originalname;

                   console.log("in upload ",file_name);
                
                //var paths="../dbfiles/"+file_name;
				 var paths="/home/ubuntu/dbfiles/"+file_name;
                callback(null,paths)
                });
            
            
        },
       function(paths,callback)
         {
             updateuploaddumplog(tbl,paths);
             updatedumplogfromcams();
            callback(null)
             
             
         }
        ], function (err, result) 
          {
            if (err)
              {
                console.log(err);   
              }
        res.render('Admin/uploadcsv');
      });   
});

router.post('/uploadkarvysfile',function(req,res,next)
{
    console.log("upload csv to Db karvys");
    var tbl="karvystrxnlog";
     var file_name;
    async.waterfall([
      function(callback)
        {
            uploaddb(req,res,function(err) 
                {
                    if(err) 
                    {
                     console.log(err);
                     console.log("Error uploading file.");
                    }
                  console.log("File is uploaded");
                
                    file_name=req.file.originalname;

                   console.log("in upload ",file_name);
                var paths="/home/ubuntu/dbfiles/"+file_name;
              //  var paths="../dbfiles/"+file_name;
                callback(null,paths)
                });
            
            
        },
       function(paths,callback)
         {
          updateuploaddumplog(tbl,paths); 
           updatedumplogfromkarvy();
             callback(null)
             
             
         }
        ], function (err, result) 
          {
            if (err)
              {
                console.log(err);   
              }
        res.render('Admin/uploadcsv');
      });   
});

router.post('/uploadftfile',function(req,res,next)
{
    console.log("upload csv to Db karvys");
    var tbl="fttrxnlog";
     var file_name;
    async.waterfall([
      function(callback)
        {
            uploaddb(req,res,function(err) 
                {
                    if(err) 
                    {
                     console.log(err);
                     console.log("Error uploading file.");
                    }
                  console.log("File is uploaded");
                
                    file_name=req.file.originalname;

                   console.log("in upload ",file_name);
                var paths="/home/ubuntu/dbfiles/"+file_name;
               // var paths="../dbfiles/"+file_name;
                callback(null,paths)
                });
            
            
        },
       function(paths,callback)
         {
           updateuploaddumplog(tbl,paths); 
            updatedumplogfromft();
             callback(null)
             
             
         }
        ], function (err, result) 
          {
            if (err)
              {
                console.log(err);   
              }
        res.render('Admin/uploadcsv');
      });   
});



//rows insert from Uploaded file  

function updateuploaddumplog(tbl,path){
    
    
  //  client.connect();
    
    pg.connect(conString,function(err,client,done)
    {      
        if(err)
         {
              return console.error('Could not connect to postgres' , err);
         }
        
       //console.log(path);
        
         var qury="'"+path+"'";
        console.log(qury);
        //console.log(qury);
       var query = client.query("COPY "+tbl+" FROM " +qury+" DELIMITER ',' CSV HEADER",function(err, result)
            {
                if (err) 
                    //callback(err,null); 
                    console.log("error",err)
                else
                {
                    //callback(null,result.rows);
                    console.log("insert to "+tbl+" table Success...!");
        
                }
            });
        done();
     });
    
     //client.end();

    
}

//Insert rows to dumplog from camstrxnlog table
function updatedumplogfromcams()
{
    
    console.log("dumplog update");
   // client.connect();
    pg.connect(conString,function(err,client,done){
        if(err){
            return console.log("Could not connect to postgres",err);
        }
        var query=client.query("INSERT INTO dumplog(foliono,pan,scheme,amount,transaction_type,transaction_id,transaction_ref,transaction_status,remarks,nav,nav_date,units,usrtrxno,trade_date,post_date,trxn_nature,scheme_type,scanref_no,seq_no) SELECT folio_no,pan,SCHEME,AMOUNT,TRXN_TYPE_,TRXNNO,TRXNNO,TRXNSTAT,REMARKS,PURPRICE,REP_DATE,UNITS,USRTRXNO,TRADDATE,POSTDATE,TRXN_NATUR,SCHEME_TYPE,SCANREFNO,SEQ_NO from camstrxnlog",function(err,result){
            
            if(err)
                console.log("Cant insert to dumplog from camstrxnlog",err);
            else
                console.log("Dumplog Insert success..!");
            
        });
        done();
    });
    //client.end();
}

//Insert rows to dumplog from karvystrxnlog table
function updatedumplogfromkarvy()
{
    
    console.log("dumplog update");
  //  client.connect();
    pg.connect(conString,function(err,client,done){
        if(err){
            return console.log("Could not connect to postgres",err);
        }
        var query=client.query("INSERT INTO dumplog(pan,scheme,schemecode,amount,transaction_type,transaction_id,transaction_ref,transaction_status,transaction_mode,transaction_head,transaction_date,remarks,nav,units,nav_date,trade_date,newunqno,rejtrnoorgno,invester_status,trflag) SELECT pan1,fund_dscp,scheme_code,AMOUNT,trxn_type,trxnid,trxnno,trxnstatus,trxnmode,trxn_head,trxn_date,Remarks,nav,units,nav_date,purchase_date,newunqno,rejtrnoorgno,status,trxn_flag from karvystrxnlog",function(err,result){
            
            if(err)
                console.log("Cant insert to dumplog from karvytrxnlog",err);
            else
                console.log("Dumplog Insert success..!");
            
        });
        done();
    });
   // client.end();
}
//Insert rows to dumplog from fttrxnlog table
function updatedumplogfromft()
{
    
    console.log("dumplog update");
  //  client.connect();
    pg.connect(conString,function(err,client,done){
        if(err){
            return console.log("Could not connect to postgres",err);
        }
        var query=client.query("INSERT INTO dumplog(foliono,scheme,schemecode,amount,transaction_type,transaction_id,transaction_ref,transaction_status,transaction_mode,transaction_date,remarks,nav,units,trade_date,post_date,kyc_id,pan) SELECT folio_no,SCHEME_NA,SCHEME_CO0,AMOUNT,TRXN_TYPE,TRXN_ID,TRXN_NO,TRXN_STAT,TRXN_MODE,TRXN_DATE,remarks,NAV,UNITS,CREA_DATE,POSTDT_DA3,KYC_ID,it_pan_no1 from fttrxnlog",function(err,result){
            
            if(err)
                console.log("Cant insert to dumplog from fttrxnlog",err);
            else
                console.log("Dumplog Insert success..!");
            
        });
        done();
    });
   // client.end();
}


router.get('/forms',function(req,res,next)
{
    res.render('Admin/forms');
});
    

// function joins the two tables tbl1, tbl2 on user_id returns joined result

function getAllRecordsJoin(tbl,tbl2, callback)
{ 
    var pg = require('pg');
   // client.connect();
    
    pg.connect(conString,function(err,client,done)
    {      
        if(err)
         {
              return console.error('Could not connect to postgres' , err);
         }
       
       var query = client.query("SELECT * FROM "+tbl+" INNER JOIN "+tbl2+" ON "+tbl+".user_id="+tbl2+".user_id", function(err, result)
            {
                if (err) 
                    callback(err,null); 
                else
                {
                    callback(null,result.rows);
        
                }
            });
        done();
     });
    
     //client.end();
}
function updatedoc(id,val1,val2)
{ 
  //  var pg = require('pg');
  //  client.connect();
    pg.connect(conString,function(err,client,done)
    {      
        
        console.log(id);
        if(err)
         {
              return console.error('Could not connect to postgres' , err);
         }
       var query = client.query("update pandetails set "+val1+"=$2 where userid=$1",[id,val2],function(err, result)
            {
                if (err) 
                   console.log("doc update error "+err);
                else
                {
                    console.log("doc update sucess");
        
                }
            });
        done();
     });
    
    //client.end();
}



module.exports = router;