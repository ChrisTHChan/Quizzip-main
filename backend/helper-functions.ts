const splitString = (str: string, num: number) => {
    const len = str.length / num;
    const creds = str.split("").reduce((acc: any, val) => {
       let { res, currInd } = acc;
       if(!res[currInd] || res[currInd].length < len){
          res[currInd] = (res[currInd] || "") + val;
       }else{
          res[++currInd] = val;
       };
       return { res, currInd };
    }, {
       res: [],
       currInd: 0
    });
    return creds.res;
 }
 
 module.exports = { 
    splitString, 
 };