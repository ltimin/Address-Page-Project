var address = {
    utilities: {}
    , layout: {}
    , page: {
        handlers: {
        }
        , startUp: null
    }
    , services: {}
    , ui: {}

};
address.moduleOptions = {
    APPNAME: "AddressApp"
    , extraModuleDependencies: []
    , runners: []
    , page: address.page//we need this object here for later use
}
var ADDRESS_AUTH = null;
address.layout.startUp = function () {
    console.debug("address.layout.startUp");
    if (ADDRESS_AUTH) {
        console.debug("setting ADDRESS_AUTH header to " + ADDRESS_AUTH);
        $.ajaxSetup({
            headers: { 'ADDRESS-AUTH': ADDRESS_AUTH }
        });
    }
    //this does a null check on address.page.startUp
    if (address.page.startUp) {
        console.debug("address.page.startUp");
        address.page.startUp();
    }
};
address.APPNAME = "AddressApp";//legacy
$(document).ready(address.layout.startUp);

//Start of the StartUp Functionality
address.page.startUp = function () {
    console.log("Address page is online.")

    $("#userFormSubmit").on("click", address.page.handlers.userFormSubmit);
    $("#list").on("click", ".listing-row", address.page.handlers.editAddress);
    $("#list").on("click", ".delete", address.page.handlers.deleteAddress);

}
//Beginning of Handlers
//This is for the Create Form Button Functionality
address.page.handlers.userFormSubmit = function () {
    var data = address.page.readAddress();
    address.page.addAddress(data);
    address.page.clearAddress();
    address.page.activeAddress = null;
}
//Handler Event to trigger the old data and place it in the form inputs to edit and update template
address.page.handlers.editAddress = function () {
    address.page.activeAddress = this;
    var inputData = address.page.readAddressForEdit();
    address.page.setFormForEdit(inputData);
    $("#userFormSubmit").val("Update Address");

}
//END OF HANDLERS

// 1. Read Address
address.page.readAddress = function () {
    var addressData = {
        addressLine1: $("#address-line1").val(),
        addressLine2: $("#address-line2").val(),
        city: $("#city").val(),
        state: $("#state").val(),
        zip: $("#postal-code").val(),
        country: $("#country").val()
    };
    return addressData;
}

// 2. Load the Template (have to load it prior to adding it)
address.page.loadTemplate = function () {
    return $($("#template").html());
}

//3. Add/Edit Address information in Template and Post to the side
address.page.addAddress = function (data) {
    var getAddress;
    if (address.page.activeAddress) {
        getAddress = $(address.page.activeAddress);
    }
    else {
        getAddress = address.page.loadTemplate();
    }
    getAddress.find(".line-one").text(data.addressLine1);
    getAddress.find(".line-two").text(data.addressLine2);
    getAddress.find(".city-name").text(data.city);
    getAddress.find(".state-name").text(data.state);
    getAddress.find(".zip-code").text(data.zip);
    getAddress.find(".country").text(data.country);
//Set Map
    var mapSrc =
        "https://maps.googleapis.com/maps/api/staticmap?center=" + 
        data.addressLine1 + " " +
        data.addressLine2 + " " +
        data.city + " " +
        data.state + " " +
        data.zip + " " +
        data.country + "&zoom=13&size=100x100&key=AIzaSyCQHurErpXDh3Y89jvtzzv_O_3tYyoeptI";

    getAddress.find("a img").prop("src", mapSrc);

    if (!address.page.activeAddress) {
        $("#list").append(getAddress);
    }
    else {
        $("#userFormSubmit").val("Create Address");
    }
}
//Additional Edit Functionality 
//This is to read/get what's in the Address Posted
address.page.readAddressForEdit = function () {
    var taskAddress = {
        addressLine1: $(address.page.activeAddress).find(".line-one").text(),
        addressLine2: $(address.page.activeAddress).find(".line-two").text(),
        city: $(address.page.activeAddress).find(".city-name").text(),
        state: $(address.page.activeAddress).find(".state-name").text(),
        zip: $(address.page.activeAddress).find(".zip-code").text(),
        country: $(address.page.activeAddress).find(".country").text()
    };
    return taskAddress;
}
//This is to place the new update Address data back into the old form.
address.page.setFormForEdit = function (inputData) {
    $("#address-line1").val(inputData.addressLine1);
    $("#address-line2").val(inputData.addressLine2);
    $("#city").val(inputData.city);
    $("#state").val(inputData.state);
    $("#postal-code").val(inputData.zip);
    $("#country").val(inputData.country);   
}
//ENDING OF EDIT FUNCTIONALITY//

//Delete Address functionality
address.page.handlers.deleteAddress = function (event) {
    event.stopPropagation();
    $(this).closest(".listing-row").remove();
}
//ENDING OF DELETE BUTTON FUNCTIONALITY//
//Clears Form
address.page.clearAddress = function () {
    $("form")[0].reset();
}