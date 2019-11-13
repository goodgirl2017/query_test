// assume the userid is stored at sessionstorage as userId:
// https://stackoverflow.com/questions/11609376/share-data-between-html-pages:
// https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/64585802/How+to+Get+the+Current+User
// document.getElementById("holder").style.display = "none";
// document.getElementById("loading").style.display = "block";

function defaultObservation(){
  return {
    heartRate: {value: []}
  };
}

function getHeartRates(obv) {
  var rates = [];
  obv.forEach(function(observation){
    rates.push(getQuantityValueAndUnit(observation[0]));

  });

  return rates;
}

function getQuantityValueAndUnit(ob) {
  if (typeof ob != 'undefined' &&
      typeof ob.valueQuantity != 'undefined' &&
      typeof ob.valueQuantity.value != 'undefined' &&
      typeof ob.valueQuantity.unit != 'undefined') {
        return ob.valueQuantity.value + ' ' + ob.valueQuantity.unit;
  } else {
    return undefined;
  }
}


function toggle(id){
  var tb=document.getElementById(id);
  if(tb.style.display=='none') tb.style.display='block';
  // else tb.style.display='none';
}

function drawVisualization(p) {
  toggle('holder');
  // $('#loading').hide();
  // $('#heartRate').html(p.heartRate);
  p.heartRate.forEach(function(value) {
    var table = document.getElementById('query_table');
    var row = table.insertRow(1);
    var cell = row.insertCell(0);
    cell.insertHTML = value;
  })
}

// Validates that the input string is a valid date formatted as "mm/dd/yyyy"
// credits goes to https://stackoverflow.com/questions/6177975/how-to-validate-date-with-format-mm-dd-yyyy-in-javascript
function isValidDate(dateString)
{
    // First check for the pattern
    if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
        return false;

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var year = parseInt(parts[2], 10);
    var month = parseInt(parts[0], 10);
    var day = parseInt(parts[1], 10);

    // get current date
    var today = new Date();
    var currentYear = today.getFullYear();
    var currentMonth = today.getMonth() + 1;
    var currentDay = today.getDate();

    // Check the ranges of month and year
    if(year < 1000 || year > currentYear || month == 0 || month > 12)
        return false;

    var monthDays = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthDays[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthDays[month - 1];
};

function checkInputValidation(startDay, endDay) {

  // the start date must be a valid date
  if (!isValidDate(startDay)){
     window.alert("Start Date is not valid");}

  // the end date must be a valid date
  else if (!isValidDate(endDay)){
     window.alert("End Date is not valid");}

  // the start date must be no later than end date
  else if (Date.parse(startDay) > Date.parse(endDay)){
    window.alert("End Date should no earlier than start Date");}
}

function search(){

    var startDay = $('#start').val();

    var endDay =$('#end').val();

    checkInputValidation(startDay, endDay);

      // var patientId = sessionstorage.getItem('patientId')
      window.alert("line111");}

      var ret = $.Deferred();

      function onError() {
        console.log('Loading error', arguments);
        ret.reject();
      }

          function onReady(smart)  {
            if (smart.hasOwnProperty('patient')) {
              var patient = smart.patient;
              var pt = patient.read();
              var obv = smart.patient.api.fetchAll({
                          type: 'Observation',
                          query: {
                            // patient: patientId,

                            code: 'http://loinc.org|8867-4',

                            date: {
                              $and: ['ge'.join(startDay), 'le'.join(endDay)]
                            }

                          }
                        });

              $.when(pt, obv).fail(onError);

              $.when(pt, obv).done(function(patient, obv) {
                var byCodes = smart.byCodes(obv, 'code');

                var heartRate = byCodes('8867-4');

                var p = defaultObservation();
                p.heartRate = getHeartRates(obv);

                drawVisualization(p);

                ret.resolve(p);

              });

            } else {
              onError();
            }
          }


          FHIR.oauth2.ready(onReady, onError);

          return ret.promise();
}
