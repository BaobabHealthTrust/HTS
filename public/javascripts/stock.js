TTInput.prototype.validateRange = function () {
    var minValue = null;
    var maxValue = null;
    var absMinValue = null;
    var absMaxValue = null;
    var tooSmall = false;
    var tooBig = false;
    this.shouldConfirm = false;

    if (isDateElement(this.formElement)) {
        // this.value.match(/(\d+)\/(\d+)\/(\d+)/);

        this.value = this.value.replace(/\//g, '-');
        var thisDate = new Date(this.value);
        // var thisDate = new Date(RegExp.$3,parseFloat(RegExp.$2)-1, RegExp.$1);
        minValue = this.element.getAttribute("min");
        maxValue = this.element.getAttribute("max");
        absMinValue = this.element.getAttribute("absoluteMin");
        absMaxValue = this.element.getAttribute("absoluteMax");

        if (absMinValue) {
            absMinValue = absMinValue.replace(/\//g, '-');
            var minDate = new Date(absMinValue);
            if (minDate && (thisDate.valueOf() < minDate.valueOf())) {
                tooSmall = true;
                minValue = absMinValue;
            }
        }
        if (absMaxValue) {
            absMaxValue = absMaxValue.replace(/\//g, '-');
            var maxDate = new Date(absMaxValue);

            if (maxDate && (thisDate.valueOf() > maxDate.valueOf())) {
                tooBig = true;
                maxValue = absMaxValue;
            }
        }
        if (!tooSmall && !tooBig) {
            if (minValue) {
                minValue = minValue.replace(/\//g, '-');
                var minDate = new Date(minValue);
                if (minDate && (thisDate.valueOf() < minDate.valueOf())) {
                    tooSmall = true;
                    this.shouldConfirm = true;
                }
            }
            if (maxValue) {
                maxValue = maxValue.replace(/\//g, '-');
                var maxDate = new Date(maxValue);

                if (maxDate && (thisDate.valueOf() > maxDate.valueOf())) {
                    tooBig = true;
                    this.shouldConfirm = true;
                }
            }
        }

    } else if (this.element.getAttribute("field_type") == "number") {
        // this.value = this.getNumberFromString(this.value);
        var numValue = null;
        if (!isNaN(this.getNumberFromString(this.element.value)))
            numValue = this.getNumberFromString(this.element.value);
        else if (!isNaN(this.getNumberFromString(this.formElement.value)))
            numValue = this.getNumberFromString(this.formElement.value);
        else
            return "";


        minValue = this.getNumberFromString(this.element.getAttribute("min"));
        maxValue = this.getNumberFromString(this.element.getAttribute("max"));
        absMinValue = this.getNumberFromString(this.element.getAttribute("absoluteMin"));
        absMaxValue = this.getNumberFromString(this.element.getAttribute("absoluteMax"));

        if (!isNaN(numValue) && !isNaN(absMinValue)) {
            if (numValue < absMinValue) {
                tooSmall = true;
                minValue = absMinValue;
            }
        }
        if (!isNaN(numValue) && !isNaN(absMaxValue)) {
            if (numValue > absMaxValue) {
                tooBig = true;
                maxValue = absMaxValue;
            }
        }
        if (!tooBig && !tooSmall) {
            if (!isNaN(numValue) && !isNaN(minValue)) {
                if (numValue < minValue) {
                    tooSmall = true;
                    this.shouldConfirm = true;
                }
            }
            if (!isNaN(numValue) && !isNaN(maxValue)) {
                if (numValue > maxValue) {
                    tooBig = true;
                    this.shouldConfirm = true;
                }
            }
        }
    }

    if (tooSmall || tooBig) {
        if (!isNaN(minValue) && !isNaN(maxValue))
            return "" + (typeof(tstLocaleWords) != "undefined" ?
                (tstLocaleWords["value out of range"] ? tstLocaleWords["value out of range"] : "Value out of Range") : "Value out of Range") + ": " + minValue + " - " + maxValue;
        if (tooSmall) return "" + (typeof(tstLocaleWords) != "undefined" ?
            (tstLocaleWords["value smaller than minimum"] ? tstLocaleWords["value smaller than minimum"] : "Value smaller than minimum") : "Value less than available stock of") + ": " + minValue;
        if (tooBig) return "" + (typeof(tstLocaleWords) != "undefined" ?
            (tstLocaleWords["value bigger than maximum"] ? tstLocaleWords["value bigger than maximum"] : "Value bigger than maximum") : "Value exceeds available stock of") + ": " + maxValue;
    }
    return "";
}