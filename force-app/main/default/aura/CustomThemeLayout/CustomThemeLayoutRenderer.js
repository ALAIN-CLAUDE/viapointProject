({
	 afterRender : function(cmp,helper){
        this.superAfterRender();
        var elements = document.getElementsByClassName("triggerDownArrow");
        console.log("elements.length: " + elements.length);
        for (var i=0; i<elements.length; i++) {
            $A.util.removeClass(elements, 'triggerDownArrow');
        }
    }// Your renderer method overrides go here
})