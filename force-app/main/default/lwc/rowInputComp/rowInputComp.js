import { LightningElement, api } from 'lwc';

export default class RowInputComp extends LightningElement {
    @api itemValue;
    @api inputValue1;
    @api inputValue2;
    @api result;

    handleNumberChange1(event){
        var selectedRow = event.currentTarget;
        var key = selectedRow.dataset.id;
        var name = selectedRow.dataset.name;
        console.log('selectedRow', selectedRow);
        console.log('key', key);
        console.log('name ', name);
        this.inputValue1 = event.target.value;       
       
      this.value1= event.target.value;
        console.log('selectedValue1',  this.inputValue1);
        console.log('selectedValue2', this.getselValue2());
        let val2 = this.getselValue2();
        console.log('val2', val2);
       // this.resultSum = parseInt(this.selectedValue1) +   parseInt(selectedValue2);
       
        this.result = parseInt(val2) +   parseInt(this.inputValue1);
    }

    handleNumberChange2(event){
        var selectedRow = event.currentTarget;
        var key = selectedRow.dataset.id;
        var name = selectedRow.dataset.name;
        console.log('selectedRow', selectedRow);
        console.log('key', key);
        console.log('name this.getselValue2()', this.getselValue1());
        this.inputValue2 = event.target.value;
        let value1 =this.getselValue1();
        this.result = parseInt(value1) + parseInt(this.inputValue2);
        
      
    }
  
    getselValue1(){
        return this.inputValue1;
    }

    getselValue2(){
        return this.inputValue2;
    }
}