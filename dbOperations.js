
var pg = require('pg');
//var waterfall = require('async-waterfall');

var conString = process.env.DATABASE_URL ||  "postgres://postgres:postgres@localhost:5432/investory";
//var conString = process.env.DATABASE_URL ||  "postgres://user1:12345@localhost:5432/investorydb";
/*

var conString = {
  user: 'user1', //env var: PGUSER
  database: 'investory', //env var: PGDATABASE
  password: '12345', //env var: PGPASSWORD
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: -1, // max number of clients in the pool
  idleTimeoutMillis: 5000, // how long a client is allowed to remain idle before being closed
};
*/
var client = new pg.Client(conString);


module.exports = { 
 
//Update kyc record status by ajax call   
updateRecord : function(req, res){
    console.log(req.query.selected);

     pg.connect(conString,function(err,client,done)
    {      
        if(err)
         {
              return console.error('Could not connect to postgres' , err);
         }
         
         var query = client.query( "UPDATE pandetails SET kycstatus=$1 WHERE userid=$2",[req.query.selected,req.query.id],function(err, result)
            {
                if (err) 
                    console.log("error in update",err); 
                else
                {
                     console.log('Update Success approval');
        
                }
            }); 
         done();
     });
   // client.end();
   
    },
    
    insertinto:function(){
        var tbl="pandetails";
        pg.connect(conString,function(err,client,done)
    {      
        if(err)
         {
              return console.error('Could not connect to postgres' , err);
         }
    
           var querry=client.query("update pandetails set kycstatus='Progress' where addressproof='uploaded' AND idproof='uploaded' AND signatureproof='uploaded' AND kycvideo='uploaded' AND nachform='uploaded' AND bsestarapplication='uploaded' AND statutoryform='uploaded' AND kycstatus='Pending'",function(err, result)
           {
                if (err) 
                   console.log("progress update error "+err);
                else
                {
                    console.log("doc update sucess");
        
                }
            });
        done();
     });
    
     //client.end();
    },

   
         
    getRecords: function(req, res){
      console.log("Hi..!");
        var tbl2='users';
        var tbl='pandetails';
    //    client.connect();
        pg.connect(conString,function(err,client,done)
    {      
        if(err)
         {
              return console.error('Could not connect to postgres' , err);
         }
            
            
    
      var query = client.query("SELECT *, now()::date-pandetails.created::date as ageing FROM pandetails INNER JOIN users ON "+tbl+".userid="+tbl2+".userid where kycstatus in ('Pending','Progress') ");
            
             
        query.on("row", function (row, result) {
            
            result.addRow(row);
            
        });
   var a=[];
             query.on("end", function (result) {
            //  client.end();       
          res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write(JSON.stringify(result.rows, null, "    ") + "\n");
               //console.log(result.rows);            
         res.end();
        });

       
     });
       
    
  },  
    getReconcileRecords: function(req, res){

          //  tbl2="dumplog";
            tbl="userinvestmentorders";
            
        console.log("records");
       // client.connect();
       pg.connect(conString,function(err,client,done)
    {      
        if(err)
         {
              return console.error('Could not connect to postgres' , err);
         }
    
           
           var query = client.query("SELECT t1.userpan,t1.userinvestmentorderid,t1.amount,t1.schemeid,t1.bsestatus,t1.nav,t1.units,t1.foliono,t1.bsetxnreference,t2.name,t2.email,t3.name as sname,now()::date-t1.created::date as ageing from userinvestmentorders as t1 inner join users as t2 on t1.userid=t2.userid  inner join schemesmaster as t3 on t3.schemeid=t1.schemeid where t1.reconcile_status is null"); 
             
           
        query.on("row", function (row, result) {
            result.addRow(row);
        });
          
             query.on("end", function (result) {
            //  client.end();       
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write(JSON.stringify(result.rows, null, "    ") + "\n");
            res.end();
         
        });

     
     });
       
  }, 
    
    
    failedOrders:function(req,res){
        
         //  client.connect();
       pg.connect(conString,function(err,client,done)
    {      
        if(err)
         {
              return console.error('Could not connect to postgres' , err);
         }
    
             
           
           var query = client.query("SELECT foliono,transaction_id,amount,pan from dumplog where NOT EXISTS(select userinvestmentorderid from userinvestmentorders where dumplog.orderid=userinvestmentorders.userinvestmentorderid)"); 
           
        query.on("row", function (row, result) {
            result.addRow(row);
        });
          
             query.on("end", function (result) {
              //client.end();       
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write(JSON.stringify(result.rows, null, "    ") + "\n");
            res.end();
         
        });

     //console.log('result.rows');
     });
    },
    
getReconciledDumpUpdates: function(req, res,ids)
{
   tbl2="dumplog";
   tbl="userinvestmentorders";         
        //client.connect();
    console.log("Hi update");
   pg.connect(conString,function(err,client,done)
   {      
     if(err)
      {
        return console.error('Could not connect to postgres' , err);
      }
   for(let i=0;i<ids.length;i++)
   {
       console.log(ids[i]);
       
var query=client.query(
                      "UPDATE "+tbl+  
" SET nav =(SELECT "+tbl2+".nav FROM " +tbl2+" WHERE " +tbl+".userinvestmentorderid = "+tbl2+".orderid and userinvestmentorderid ="+ids[i]+" ),foliono =(SELECT "+tbl2+".foliono FROM " +tbl2+" WHERE " +tbl+".userinvestmentorderid = "+tbl2+".orderid and userinvestmentorderid ="+ids[i]+" ),bsetxnreference =(SELECT "+tbl2+".transaction_ref FROM " +tbl2+" WHERE " +tbl+".userinvestmentorderid = "+tbl2+".orderid and userinvestmentorderid ="+ids[i]+" ), units =(SELECT "+tbl2+".units FROM " +tbl2+" WHERE " +tbl+".userinvestmentorderid = "+tbl2+".orderid and userinvestmentorderid ="+ids[i]+" ) WHERE " +tbl+".userinvestmentorderid=(SELECT " +tbl2+".orderid FROM "+tbl2+ " WHERE  "+tbl+".userinvestmentorderid="+tbl2+".orderid and userinvestmentorderid ="+ids[i]+")",function(err, result)          
    {
      if (err) 
        console.log(err); 
      else
      {
        console.log(null,result.rows);
        
      }
     });
  }
     
});
},
       
updateStatusAsReconcile: function(req, res,ids)
{
// tbl2="dumplog";
   tbl="userinvestmentorders";         
        //client.connect();
   pg.connect(conString,function(err,client,done)
   {      
     if(err)
      {
        return console.error('Could not connect to postgres' , err);
      }
   for(let i=0;i<ids.length;i++)
   {
var query=client.query(
                      "UPDATE "+tbl+  
" SET reconcile_status='reconcile' WHERE userinvestmentorderid ="+ids[i],function(err, result)          
    {
      if (err) 
        console.log(err); 
      else
      {
        console.log(null,result.rows);
        
      }
     });
  }
     
});
    
},

};