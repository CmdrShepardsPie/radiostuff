"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Adms400OffsetFrequency;
(function (Adms400OffsetFrequency) {
    Adms400OffsetFrequency["$100_kHz"] = "100 kHz";
    Adms400OffsetFrequency["$500_kHz"] = "500 kHz";
    Adms400OffsetFrequency["$600_kHz"] = "600 kHz";
    Adms400OffsetFrequency["$1_00_MHz"] = "1.00 MHz";
    Adms400OffsetFrequency["$1_60_MHz"] = "1.60 MHz";
    Adms400OffsetFrequency["$3_00_MHz"] = "3.00 MHz";
    Adms400OffsetFrequency["$5_00_MHz"] = "5.00 MHz";
    Adms400OffsetFrequency["$7_60_MHz"] = "7.60 MHz";
})(Adms400OffsetFrequency = exports.Adms400OffsetFrequency || (exports.Adms400OffsetFrequency = {}));
var Adms400OffsetDirection;
(function (Adms400OffsetDirection) {
    Adms400OffsetDirection["Simplex"] = "Simplex";
    Adms400OffsetDirection["Minus"] = "Minus";
    Adms400OffsetDirection["Plus"] = "Plus";
    Adms400OffsetDirection["Split"] = "Split";
})(Adms400OffsetDirection = exports.Adms400OffsetDirection || (exports.Adms400OffsetDirection = {}));
var Adms400OperatingMode;
(function (Adms400OperatingMode) {
    Adms400OperatingMode["Auto"] = "Auto";
    Adms400OperatingMode["FM"] = "FM";
    Adms400OperatingMode["FM_Narrow"] = "FM Narrow";
    Adms400OperatingMode["AM"] = "AM";
})(Adms400OperatingMode = exports.Adms400OperatingMode || (exports.Adms400OperatingMode = {}));
var Adms400ShowName;
(function (Adms400ShowName) {
    Adms400ShowName["Small"] = "Small";
    Adms400ShowName["Large"] = "Large";
})(Adms400ShowName = exports.Adms400ShowName || (exports.Adms400ShowName = {}));
var Adms400ToneMode;
(function (Adms400ToneMode) {
    Adms400ToneMode["None"] = "None";
    Adms400ToneMode["Tone"] = "Tone";
    Adms400ToneMode["T_Sql"] = "T Sql";
    Adms400ToneMode["DCS"] = "DCS";
    Adms400ToneMode["Rev_CTCSS"] = "Rev CTCSS";
    Adms400ToneMode["User_CTCSS"] = "User CTCSS";
    Adms400ToneMode["Pager"] = "Pager";
    Adms400ToneMode["D_Code"] = "D Code";
    Adms400ToneMode["T_DCS"] = "T DCS";
    Adms400ToneMode["D_Tone"] = "D Tone";
})(Adms400ToneMode = exports.Adms400ToneMode || (exports.Adms400ToneMode = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaS1hZG1zNDAwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ludGVyZmFjZXMvaS1hZG1zNDAwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBb0JBLElBQVksc0JBU1g7QUFURCxXQUFZLHNCQUFzQjtJQUNoQyw4Q0FBb0IsQ0FBQTtJQUNwQiw4Q0FBb0IsQ0FBQTtJQUNwQiw4Q0FBb0IsQ0FBQTtJQUNwQixnREFBc0IsQ0FBQTtJQUN0QixnREFBc0IsQ0FBQTtJQUN0QixnREFBc0IsQ0FBQTtJQUN0QixnREFBc0IsQ0FBQTtJQUN0QixnREFBc0IsQ0FBQTtBQUN4QixDQUFDLEVBVFcsc0JBQXNCLEdBQXRCLDhCQUFzQixLQUF0Qiw4QkFBc0IsUUFTakM7QUFFRCxJQUFZLHNCQUtYO0FBTEQsV0FBWSxzQkFBc0I7SUFDaEMsNkNBQW1CLENBQUE7SUFDbkIseUNBQWUsQ0FBQTtJQUNmLHVDQUFhLENBQUE7SUFDYix5Q0FBZSxDQUFBO0FBQ2pCLENBQUMsRUFMVyxzQkFBc0IsR0FBdEIsOEJBQXNCLEtBQXRCLDhCQUFzQixRQUtqQztBQUVELElBQVksb0JBS1g7QUFMRCxXQUFZLG9CQUFvQjtJQUM5QixxQ0FBYSxDQUFBO0lBQ2IsaUNBQVMsQ0FBQTtJQUNULCtDQUF1QixDQUFBO0lBQ3ZCLGlDQUFTLENBQUE7QUFDWCxDQUFDLEVBTFcsb0JBQW9CLEdBQXBCLDRCQUFvQixLQUFwQiw0QkFBb0IsUUFLL0I7QUFFRCxJQUFZLGVBR1g7QUFIRCxXQUFZLGVBQWU7SUFDekIsa0NBQWUsQ0FBQTtJQUNmLGtDQUFlLENBQUE7QUFDakIsQ0FBQyxFQUhXLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBRzFCO0FBRUQsSUFBWSxlQVdYO0FBWEQsV0FBWSxlQUFlO0lBQ3pCLGdDQUFhLENBQUE7SUFDYixnQ0FBYSxDQUFBO0lBQ2Isa0NBQWUsQ0FBQTtJQUNmLDhCQUFXLENBQUE7SUFDWCwwQ0FBdUIsQ0FBQTtJQUN2Qiw0Q0FBeUIsQ0FBQTtJQUN6QixrQ0FBZSxDQUFBO0lBQ2Ysb0NBQWlCLENBQUE7SUFDakIsa0NBQWUsQ0FBQTtJQUNmLG9DQUFpQixDQUFBO0FBQ25CLENBQUMsRUFYVyxlQUFlLEdBQWYsdUJBQWUsS0FBZix1QkFBZSxRQVcxQiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBpbnRlcmZhY2UgSUFkbXM0MDAge1xuICBDaGFubmVsX051bWJlcjogbnVtYmVyO1xuICBSZWNlaXZlX0ZyZXF1ZW5jeTogbnVtYmVyO1xuICBUcmFuc21pdF9GcmVxdWVuY3k6IG51bWJlcjtcbiAgT2Zmc2V0X0ZyZXF1ZW5jeTogQWRtczQwME9mZnNldEZyZXF1ZW5jeTtcbiAgT2Zmc2V0X0RpcmVjdGlvbjogQWRtczQwME9mZnNldERpcmVjdGlvbjtcbiAgT3BlcmF0aW5nX01vZGU6IEFkbXM0MDBPcGVyYXRpbmdNb2RlO1xuICBOYW1lOiBzdHJpbmc7XG4gIFNob3dfTmFtZTogQWRtczQwMFNob3dOYW1lO1xuICBUb25lX01vZGU6IEFkbXM0MDBUb25lTW9kZTtcbiAgQ1RDU1M6XG4gIERDU1xuICBUeF9Qb3dlclxuICBTa2lwXG4gIFN0ZXBcbiAgQ2xvY2tfU2hpZnRcbiAgQ29tbWVudFxuICBVc2VyX0NUQ1NTXG59XG5cbmV4cG9ydCBlbnVtIEFkbXM0MDBPZmZzZXRGcmVxdWVuY3kge1xuICAkMTAwX2tIeiA9ICcxMDAga0h6JyxcbiAgJDUwMF9rSHogPSAnNTAwIGtIeicsXG4gICQ2MDBfa0h6ID0gJzYwMCBrSHonLFxuICAkMV8wMF9NSHogPSAnMS4wMCBNSHonLFxuICAkMV82MF9NSHogPSAnMS42MCBNSHonLFxuICAkM18wMF9NSHogPSAnMy4wMCBNSHonLFxuICAkNV8wMF9NSHogPSAnNS4wMCBNSHonLFxuICAkN182MF9NSHogPSAnNy42MCBNSHonLFxufVxuXG5leHBvcnQgZW51bSBBZG1zNDAwT2Zmc2V0RGlyZWN0aW9uIHtcbiAgU2ltcGxleCA9ICdTaW1wbGV4JyxcbiAgTWludXMgPSAnTWludXMnLFxuICBQbHVzID0gJ1BsdXMnLFxuICBTcGxpdCA9ICdTcGxpdCcsXG59XG5cbmV4cG9ydCBlbnVtIEFkbXM0MDBPcGVyYXRpbmdNb2RlIHtcbiAgQXV0byA9ICdBdXRvJyxcbiAgRk0gPSAnRk0nLFxuICBGTV9OYXJyb3cgPSAnRk0gTmFycm93JyxcbiAgQU0gPSAnQU0nLFxufVxuXG5leHBvcnQgZW51bSBBZG1zNDAwU2hvd05hbWUge1xuICBTbWFsbCA9ICdTbWFsbCcsXG4gIExhcmdlID0gJ0xhcmdlJyxcbn1cblxuZXhwb3J0IGVudW0gQWRtczQwMFRvbmVNb2RlIHtcbiAgTm9uZSA9ICdOb25lJyxcbiAgVG9uZSA9ICdUb25lJyxcbiAgVF9TcWwgPSAnVCBTcWwnLFxuICBEQ1MgPSAnRENTJyxcbiAgUmV2X0NUQ1NTID0gJ1JldiBDVENTUycsXG4gIFVzZXJfQ1RDU1MgPSAnVXNlciBDVENTUycsXG4gIFBhZ2VyID0gJ1BhZ2VyJyxcbiAgRF9Db2RlID0gJ0QgQ29kZScsXG4gIFRfRENTID0gJ1QgRENTJyxcbiAgRF9Ub25lID0gJ0QgVG9uZScsXG59XG4iXX0=