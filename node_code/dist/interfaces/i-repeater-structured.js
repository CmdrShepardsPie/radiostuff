"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RepeaterUse;
(function (RepeaterUse) {
    RepeaterUse["Open"] = "Open";
    RepeaterUse["Closed"] = "Closed";
    RepeaterUse["Private"] = "Private";
    RepeaterUse["Other"] = "Other";
})(RepeaterUse = exports.RepeaterUse || (exports.RepeaterUse = {}));
var RepeaterStatus;
(function (RepeaterStatus) {
    RepeaterStatus["OnAir"] = "On-Air";
    RepeaterStatus["OffAir"] = "Off-Air";
    RepeaterStatus["Testing"] = "Testing";
    RepeaterStatus["Unknown"] = "Unknown";
    RepeaterStatus["Other"] = "Other";
})(RepeaterStatus = exports.RepeaterStatus || (exports.RepeaterStatus = {}));
var EchoLinkNodeStatus;
(function (EchoLinkNodeStatus) {
    EchoLinkNodeStatus["OnIdle"] = "ON - IDLE";
    EchoLinkNodeStatus["NodeOffline"] = "Node Offline";
})(EchoLinkNodeStatus = exports.EchoLinkNodeStatus || (exports.EchoLinkNodeStatus = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaS1yZXBlYXRlci1zdHJ1Y3R1cmVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ludGVyZmFjZXMvaS1yZXBlYXRlci1zdHJ1Y3R1cmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBcUJBLElBQVksV0FLWDtBQUxELFdBQVksV0FBVztJQUNyQiw0QkFBYSxDQUFBO0lBQ2IsZ0NBQWlCLENBQUE7SUFDakIsa0NBQW1CLENBQUE7SUFDbkIsOEJBQWUsQ0FBQTtBQUNqQixDQUFDLEVBTFcsV0FBVyxHQUFYLG1CQUFXLEtBQVgsbUJBQVcsUUFLdEI7QUFFRCxJQUFZLGNBTVg7QUFORCxXQUFZLGNBQWM7SUFDeEIsa0NBQWdCLENBQUE7SUFDaEIsb0NBQWtCLENBQUE7SUFDbEIscUNBQW1CLENBQUE7SUFDbkIscUNBQW1CLENBQUE7SUFDbkIsaUNBQWUsQ0FBQTtBQUNqQixDQUFDLEVBTlcsY0FBYyxHQUFkLHNCQUFjLEtBQWQsc0JBQWMsUUFNekI7QUFFRCxJQUFZLGtCQUdYO0FBSEQsV0FBWSxrQkFBa0I7SUFDNUIsMENBQW9CLENBQUE7SUFDcEIsa0RBQTRCLENBQUE7QUFDOUIsQ0FBQyxFQUhXLGtCQUFrQixHQUFsQiwwQkFBa0IsS0FBbEIsMEJBQWtCLFFBRzdCIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBJU2ltcGxleFJlcGVhdGVySW50ZXJtZWRpYXRlIHtcclxuICBDYWxsc2lnbjogc3RyaW5nO1xyXG4gIEZyZXF1ZW5jeTogeyBJbnB1dDogbnVtYmVyOyBPdXRwdXQ6IG51bWJlciB9O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElSZXBlYXRlclN0cnVjdHVyZWQge1xyXG4gIElEOiBudW1iZXI7XHJcbiAgU3RhdGVJRDogbnVtYmVyO1xyXG4gIENhbGxzaWduOiBzdHJpbmc7XHJcbiAgLy8gTmFtZTogc3RyaW5nO1xyXG4gIExvY2F0aW9uOiB7IExhdGl0dWRlOiBudW1iZXI7IExvbmdpdHVkZTogbnVtYmVyOyBDb3VudHk6IHN0cmluZzsgU3RhdGU6IHN0cmluZzsgTG9jYWw6IHN0cmluZywgRGlzdGFuY2U/OiBudW1iZXIgfTtcclxuICBVc2U6IFJlcGVhdGVyVXNlO1xyXG4gIFN0YXR1czogUmVwZWF0ZXJTdGF0dXM7XHJcbiAgRnJlcXVlbmN5OiB7IElucHV0OiBudW1iZXI7IE91dHB1dDogbnVtYmVyIH07XHJcbiAgU3F1ZWxjaFRvbmU/OiB7IElucHV0PzogbnVtYmVyOyBPdXRwdXQ/OiBudW1iZXIgfTtcclxuICBEaWdpdGFsVG9uZT86IHsgSW5wdXQ/OiBudW1iZXI7IE91dHB1dD86IG51bWJlciB9O1xyXG4gIERpZ2l0YWw/OiBJUmVwZWF0ZXJEaWdpdGFsTW9kZXM7XHJcbiAgVk9JUD86IElSZXBlYXRlclZPSVBNb2RlcztcclxuICAvLyBDb21tZW50OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIFJlcGVhdGVyVXNlIHtcclxuICBPcGVuID0gXCJPcGVuXCIsXHJcbiAgQ2xvc2VkID0gXCJDbG9zZWRcIixcclxuICBQcml2YXRlID0gXCJQcml2YXRlXCIsXHJcbiAgT3RoZXIgPSBcIk90aGVyXCIsXHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIFJlcGVhdGVyU3RhdHVzIHtcclxuICBPbkFpciA9IFwiT24tQWlyXCIsXHJcbiAgT2ZmQWlyID0gXCJPZmYtQWlyXCIsXHJcbiAgVGVzdGluZyA9IFwiVGVzdGluZ1wiLFxyXG4gIFVua25vd24gPSBcIlVua25vd25cIixcclxuICBPdGhlciA9IFwiT3RoZXJcIixcclxufVxyXG5cclxuZXhwb3J0IGVudW0gRWNob0xpbmtOb2RlU3RhdHVzIHtcclxuICBPbklkbGUgPSBcIk9OIC0gSURMRVwiLFxyXG4gIE5vZGVPZmZsaW5lID0gXCJOb2RlIE9mZmxpbmVcIixcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUmVwZWF0ZXJEaWdpdGFsTW9kZXMge1xyXG4gIEFUVj86IGJvb2xlYW47XHJcbiAgRE1SPzogeyBDb2xvckNvZGU/OiBudW1iZXI7IElEPzogbnVtYmVyIH07XHJcbiAgUDI1PzogeyBOQUM/OiBudW1iZXI7IH07XHJcbiAgRFN0YXI/OiB7IE5vZGU/OiBzdHJpbmc7IH07XHJcbiAgWVNGPzogeyBHcm91cElEPzogeyBJbnB1dD86IHN0cmluZzsgT3V0cHV0Pzogc3RyaW5nIH07IH07XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVJlcGVhdGVyVk9JUE1vZGVzIHtcclxuICBBbGxTdGFyPzogeyBOb2RlSUQ/OiBudW1iZXI7IH07XHJcbiAgRWNob0xpbms/OiB7IE5vZGVJRD86IG51bWJlcjsgQ2FsbD86IHN0cmluZzsgU3RhdHVzPzogRWNob0xpbmtOb2RlU3RhdHVzIH07XHJcbiAgSVJMUD86IHsgTm9kZUlEPzogbnVtYmVyOyB9O1xyXG4gIFdpcmVzPzogeyBJRD86IG51bWJlcjsgfTtcclxufVxyXG4iXX0=