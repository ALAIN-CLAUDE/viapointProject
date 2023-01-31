import { LightningElement, track, api, wire } from 'lwc';
import getOrgAudActivityResource from '@salesforce/apex/cpGetAuditActivityResourceListNew.getOrgAudActivityResource';
import getOrder from '@salesforce/apex/cpGetCapaList.getOrders';

const column = [{

    "Id": "a1z52000001gP3tAAE",

    "Name": "Investment classification",

    "_children": [{

            "Id": "a1z52000001gP4NAAU",

            "Name": "Request Allocation Units2",



        }, {

            "Id": "a1z52000001gP4IAAU",

            "Name": "Request Allocation Units2",



        }

    ],

    "selected": [{

            "Id": "a1z52000001gP4NAAU",

            "Name": "Request Allocation Units1",



        }, {

            "Id": "a1z52000001gP4SAAU",

            "Name": "Request Allocation Units2",



        }

    ]

}

];

export default class TestComp extends LightningElement {
    firstValue;
    colums;
    da;
    @track items;
    @track value1;
    @track value2;
    takeValue;
    resultSum;
  

    getSecondFiledValueById(firstId){
        console.log('firstId', firstId);
        this.template.querySelectorAll('lightning-input-field').forEach(each => {
            each.value = '';
        });
    }

    handleNumberChange(event){
        var selectedRow = event.currentTarget;
        var key = selectedRow.dataset.id;
        var name = selectedRow.dataset.name;
        console.log('selectedRow', selectedRow);
        console.log('key', key);
        console.log('name ', name);
        this.selectedValue1 = event.target.value;       
       
      this.value1= event.target.value;
        console.log('selectedValue1',  this.selectedValue1);
        console.log('selectedValue2', this.getselValue2());
        let val2 = this.getselValue2();
        console.log('val2', val2);
       // this.resultSum = parseInt(this.selectedValue1) +   parseInt(selectedValue2);
       
        this.selectedValue3 = parseInt(val2) +   parseInt(this.selectedValue1);
    }

    handleNumberChange2(event){
        var selectedRow = event.currentTarget;
        var key = selectedRow.dataset.id;
        var name = selectedRow.dataset.name;
        console.log('selectedRow', selectedRow);
        console.log('key', key);
        console.log('name this.getselValue2()', this.getselValue1());
        this.selectedValue2 = event.target.value;
        let value1=this.getselValue1();
        this.selectedValue3 = parseInt(value1) + parseInt(this.selectedValue2);
        this.resultSum = this.selectedValue3;
        //this.result();
      
    }
    getselValue1(){
        return this.selectedValue1;
    }

    getselValue2(){
        return this.selectedValue2;
    }

    result() {           
        console.log('result.selectedValue1', this.selectedValue1);     
        console.log('result.selectedValue1', this.selectedValue2);   
        console.log('result. this.value1', this.value1);        
        console.log('result. this.value2', this.value2);        
        this.selectedValue3 = parseInt(this.value1) +   parseInt(this.value2);
        console.log('  this.selectedValue3',   this.selectedValue3);
     }
getData(){
    this.takeValue =  [{

        "Id": "a1z52000001gP3tAAE",

        "Name": "Investment classification",

        "_children": [{

                "Id": "a1z52000001gP4NAAU",

                "Name": "Request Allocation Units2",

   

            }, {

                "Id": "a1z52000001gP4IAAU",

                "Name": "Request Allocation Units2",

   

            }

        ],

        "selected": [{

                "Id": "a1z52000001gP4NAAU",

                "Name": "Request Allocation Units1",

   

            }, {

                "Id": "a1z52000001gP4SAAU",

                "Name": "Request Allocation Units2",

   

            }

        ]

    }

    ];
  console.log('takeValue ', this.takeValue);
   console.log('takeValue ', this.takeValue);
  this.items = this.takeValue;
  this.da = columns;
  console.log('takeValue ', this.da);
  console.log('takeValue ', this.columns);
}
@wire(getOrder)
cons(result) {       
    if(result.data){
        this.data = result.data;       
        let resp  = JSON.parse(JSON.stringify(result.data))
       // console.log('this is the audit actiiiii  data'+JSON.stringify(result.data));
     /*  resp.forEach(item => {
        item['selectedValue1'] = 1;
        item['selectedValue2'] = 2;
        //item['selectedValue3'] =0;
       
    });*/
    let audActResObj = {};                   
                   
    audActResObj['selectedValue1'] = 0;
    audActResObj['selectedValue2'] = 0;
    audActResObj['selectedValue3'] = 0;
 
    console.log('audActResObj ', audActResObj);
    resp.push(audActResObj);
        this.items  = resp;
       console.log('this.items ', JSON.stringify(this.items));
    }
    if (result.error) {
        this.data = undefined;
    }
};

/*
    @wire(getOrgAudits)
    cons(result) {
        wiredAudActRes(result) {
          if(result.data) {           
                console.log('3 section data' , result.data);
                let finalData = [];
                finalData = result.data;
                let finalDataResult = [];
                finalData.forEach(item =>  {
                    let audActResObj = {...item};                   
                   
                    audActResObj['selectedValue1'] = 0;
                    audActResObj['selectedValue2'] = 0;
                 
                    console.log('audActResObj ', audActResObj);
                    finalDataResult.push(audActResObj);
                });
         
            console.log('3 section data result', finalDataResult);
            this.items = finalDataResult;
            }
    };
    }
*/
}