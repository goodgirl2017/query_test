var times = [];
var rates = [];

(function(window){
  window.extractData = function() {
    var ret = $.Deferred();

    function onError() {
      console.log('Loading error', arguments);
      ret.reject();
    }




    function onReady(smart)  {
      if (smart.hasOwnProperty('patient')) {
        // var demoPatient = {
        //   fhirServiceUrl: "https://r2.smarthealthit.org",
        //   patientId: "smart-880378"
        // };
        // smart = FHIR.client(demoPatient);

        var patient = smart.patient;
        var pt = patient.read();

        var startDay = $('#start').val();
        var endDay =$('#end').val();

        var obv = smart.patient.api.fetchAll({
                    type: 'Observation',
                    query: {
                      // patient:'smart-880378',
                      code: {
                        $or: ['http://loinc.org|8867-4']
                      },

                      date: {
                        $and: ['ge'.concat(startDay), 'le'.concat(endDay)]
                      }

                    }
                  });

        $.when(pt, obv).fail(onError);

        $.when(pt, obv).done(function(patient, obv) {
          var byCodes = smart.byCodes(obv, 'code');

          var heart_rate = byCodes('8867-4');

          var p = defaultPatient();

          p.heart_rate = getHeartRates(heart_rate);
          p.time = getTimes(heart_rate);
          // p.heart_rate = rates;
          // p.time = times;

          ret.resolve(p);
        });
      } else {
        onError();
      }
    }

    FHIR.oauth2.ready(onReady, onError);
    return ret.promise();

  };

  function defaultPatient(){
    return {
      heart_rate: {value: []},
      time: {value: []},
    };
  }

  function getQuantityValue(ob) {
    if (typeof ob != 'undefined' &&
        typeof ob.valueQuantity != 'undefined' &&
        typeof ob.valueQuantity.value != 'undefined') {
          return ob.valueQuantity.value;
    } else {
      return undefined;
    }
  }

  function getHeartRates(obv) {
    obv.forEach(function(observation){
      // rates.push(getQuantityValue(observation[0]));
      rates.push(observation.valueQuantity.value);
			// console.log(rates);

    });

    return rates;
  };

  function getDateValue(ob) {
    if (typeof ob != 'undefined' &&
        typeof ob.effectiveDateTime != 'undefined') {
          return ob.effectiveDateTime;
    } else {
      return undefined;
    }
  };

  function getTimes(obv) {
    // var times = [];
    obv.forEach(function(observation){
      // times.push(getDateValue(observation[0]));
      times.push(observation.effectiveDateTime);
      // times.push(parseISOString(observation.effectiveDateTime));
      // console.log(times);

    });

    return times;
  };


  window.drawVisualization = function(p) {
    $('#holder').show();
    $('#bar_chart_button_space').show();
    $('#loading').hide();
    $('#logo').hide();


    // addRow(p.time, p.heart_rate);
    for (var i = 0; i < p.time.length; i++) {
      if (i % 2 != 0) {
        addRowOdd(p.time[i], p.heart_rate[i]);}

        else {
        addRowEven(p.time[i], p.heart_rate[i]);}
    }

  };

  // function of adding one single row
  function addRowOdd(time, hr) {
    var table = $("#query_table");
    table.append("<tr class = \"danger\"><td>" + time + "</td><td>" + hr + "</td></tr>");
  }

  function addRowEven(time, hr) {
    var table = $("#query_table");
    table.append("<tr class = \"info\"><td>" + time + "</td><td>" + hr + "</td></tr>");
  }

})(window);


function DrawLineChart() {
  $('#holder').hide();
  $('#charts').show();
  $('#logo').show();
  $('#bar_chart_button_space').hide();

  console.log("DrawLineChart");
  console.log(times);
  console.log(rates);

  var ctx = document.getElementById('myChart').getContext('2d');
  var chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: times,
        datasets: [{
            label: 'Line Plot',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: rates
        }]
    },
    options: {
    }
  });
}

function DrawBarChart() {
  $('#holder').hide();
  $('#charts').show();
  $('#logo').show();
  $('#bar_chart_button_space').hide();

  console.log("DrawBarChart");
  console.log(times);
  console.log(rates);
  var ctx = document.getElementById('myBarChart').getContext('2d');
  var chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: times,
        datasets: [{
            label: 'Bar Plot',
            data: rates,
            backgroundColor: ['rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)',
              'rgba(255, 159, 64, 0.7)',
              'rgba(230, 195, 195, 0.7)']
        }]
    },
    options: {}
  });
}

// source code: https://stackoverflow.com/questions/27012854/change-iso-date-string-to-date-object-javascript
function parseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

function backToTable() {
  $('#table_space').show();
  $('#holder').hide();
  $('#charts').hide();
  $('#logo').show();
  $('#bar_chart_button_space').show();
}
