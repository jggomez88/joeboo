(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

// const sendIntro = require('./send_sms');

// Interactive Onboard flow
var counter = 1;
$(document).ready(function () {
  var erroEle = $(".error-message"),
    focusInput = $(".questions").find(".active");

    // if (focusInput.attr("name") !== "phone") {
    //   $('#cta').html("");
    // }

  $(".navigation a").click(function () {
    nextMaster("navi");

    var thisInput = $("#" + $(this).attr("data-ref"));
    $(".active").removeClass("active");
    thisInput.focus().addClass("active");
    thisInput.closest("li").animate(
      {
        marginTop: "0px",
        opacity: 1
      },
      200
    );
    thisInput.closest("li").prevAll("li").animate(
      {
        marginTop: "-150px",
        opacity: 0
      },
      200
    );
    //                     .AddClass('done');

    thisInput.closest("li").nextAll("li").animate(
      {
        marginTop: "150px",
        opacity: 0
      },
      200
    );
    //                    .RemoveClass('done');
    errorMessage(erroEle, "", "hidden", 0);
    event.preventDefault();
  });

  if (focusInput.val() != "") {
    $("#next-page").css({"opacity": 1});
  }

  $(document).keypress(function (event) {
    if (event.which == 13) {
      nextMaster("keypress");
      event.preventDefault();
    }

    $("#next-page").click(function () {
      var focusInput = $(".questions").find(".active");
      nextMaster("nextpage");
      event.preventDefault();
    });
  });

  function nextMaster(type) {
    var focusInput = $(".questions").find(".active");
    if (focusInput.attr("name") == "phone") {
      // $('#cta').html(
      //   `<a href="#" style="color:#51859e;text-decoration:none" id="signup">Cool. Want to maybe hang out sometime?</a>`
      // );
      $('#next-page').css('margin-top','80px')
    }
    if (focusInput.val() != "") {
      if (
        (focusInput.attr("name") == "name" ||
          focusInput.attr("name") == "username") &&
        focusInput.val().length < 2
      ) {
        errorMessage(
          erroEle,
          "isn't your " + focusInput.attr("name") + " bit small. ",
          "visible",
          1
        );
      } else if (
        focusInput.attr("name") == "email" &&
        !validateEmail(focusInput.val())
      ) {
        errorMessage(
          erroEle,
          "It doesn't look like a " + focusInput.attr("name"),
          "visible",
          1
        );
      } else if (
        focusInput.attr("name") == "phone" &&
        !validatePhone(focusInput.val())
      ) {
        errorMessage(
          erroEle,
          "It doesn't look like a " + focusInput.attr("name"),
          "visible",
          1
        );
      } else {
        if (type != "navi") showLi(focusInput);
        $("#next-page").css({"opacity": 0});
        errorMessage(erroEle, "", "hidden", 0);
      }
    } else if (type == "keypress") {
      errorMessage(
        erroEle,
        "please enter your " + focusInput.attr("name"),
        "visible",
        1
      );
    }
  }

  $("input[type='text']").keyup(function (event) {
    var focusInput = $(this);
    if (focusInput.val().length > 1) {
      if (
        (focusInput.attr("name") == "email" &&
          !validateEmail(focusInput.val())) ||
        (focusInput.attr("name") == "phone" && !validatePhone(focusInput.val()))
      ) {
        $("#next-page").css("opacity", 0);
      } else {
        $("#next-page").css("opacity", 1);
      }
    } else {
      $("#next-page").css("opacity", 0);
    }
  });

  $("#password").keyup(function (event) {
    var focusInput = $(this);
    $("#viewpswd").val(focusInput.val());
    if (focusInput.val().length > 1) {
      $("#next-page").css("opacity", 1);
    }
  });

  $("#signup").click(function () {
    $(".navigation").fadeOut(400).css({
      display: "none"
    });
    $("#sign-form").fadeOut(400).css({
      display: "none"
    });
    $(this).fadeOut(400).css({
      display: "none"
    });
    $("#wf")
      .animate(
        {
          opacity: 1,
          marginTop: "1em"
        },
        500
      )
      .css({
        display: "block"
      });
  });

  $("#show-pwd")
    .mousedown(function () {
      $(this).toggleClass("view").toggleClass("hide");
      $("#password").css("opacity", 0);
      $("#viewpswd").css("opacity", 1);
    })
    .mouseup(function () {
      $(this).toggleClass("view").toggleClass("hide");
      $("#password").css("opacity", 1);
      $("#viewpswd").css("opacity", 0);
    });
});

function showLi(focusInput) {
  focusInput.closest("li").animate(
    {
      marginTop: "-150px",
      opacity: 0
    },
    200
  );


  if (focusInput.attr("id") == "viewpswd") {
    $("[data-ref='" + focusInput.attr("id") + "']")
      .addClass("done")
      .html("password");
    //                    .html(Array(focusInput.val().length+1).join("*"));
  } else {
    $("[data-ref='" + focusInput.attr("id") + "']")
      .addClass("done")
      .html(focusInput.val());
  }

  focusInput.removeClass("active");
  counter++;

  var nextli = focusInput.closest("li").next("li");

  nextli.animate(
    {
      marginTop: "0px",
      opacity: 1
    },
    200
  );

  nextli.find("input").focus().addClass("active");
}

function errorMessage(textmeg, appendString, visib, opaci) {
  textmeg
    .css({
      visibility: visib
    })
    .animate({
      opacity: opaci
    })
    .html(appendString);
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function validatePhone(phone) {
  var re = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
  return re.test(phone);
}

//create new user after sign up

class User {
  constructor(name,userName,email,password,phone) {
    this.name = name;
    this.userName = userName;
    this.email = email;
    this.password = password;
    this.phone = phone;
  }
}

const createUser = () => {
  let $name = $('form input#name')[0].value;
  let $userName = $('form input#uname')[0].value;
  let $email = $('form input#email')[0].value;
  let $password = $('form input#viewpswd')[0].value;
  let $phone = $('form input#phone')[0].value;

  const newUser = new User($name,$userName,$email,$password,$phone);
  return { newUser };
}

$( "#signup" ).click(function( e ) {
  const newUser = createUser().newUser;
  console.log(newUser);
  $(".submit-heading").text("It's official.").css('font-size', 'xxx-large');
  sendIntro(newUser);
  event.preventDefault();
});


const sendIntro = (user) => {
  fetch('https://us-central1-joeboo-11d25.cloudfunctions.net/sendSMS/intro', {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json"
    }
}).then((res) => {
  console.log(res.status);
}).catch((error) => {
  console.log('Error: ', error);
});
}

//Test fetch

// // console.log(JSON.stringify(testUser));

// fetch('https://us-central1-joeboo-11d25.cloudfunctions.net/sendSMS/intro', {
//     method: "POST",
//     body: JSON.stringify(testUser),
//     headers: {
//       "Content-Type": "application/json"
//     }
// }).then((res) => {
//   console.log(res.status);
// }).catch((error) => {
//   console.log('Error: ', error);
// });




},{}]},{},[1]);
