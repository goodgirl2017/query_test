(function(window){
  window.extractData = function() {
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
                      code: {
                        $or: ['http://loinc.org|8867-4']
                      }
                    }
                  });

        $.when(pt, obv).fail(onError);

        $.when(pt, obv).done(function(patient, obv) {
          var byCodes = smart.byCodes(obv, 'code');

          var heart_rate = byCodes('8867-4');

          var p = defaultPatient();
          p.heart_rate = getQuantityValue(heart_rate[0]);
          p.time = getDateValue(heart_rate[0]);

          // https://www.w3schools.com/jsref/met_table_insertrow.asp
          // var table = document.getElementById("query_table");
          // var row = table.insertRow(0);
          // var cell0 = row.insertCell(0);
          // var cell1 = row.insertCell(1);
          // // cell0.insertHTML = p.time.toString();
          // // cell1.insertHTML = p.heart_rate.toString();
          // cell0.insertHTML = "1";
          // cell1.insertHTML = "2";

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
      heart_rate: {value: ''},
      time: {value: ''},
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

  function getDateValue(ob) {
    if (typeof ob != 'undefined' &&
        typeof ob.effectiveDateTime != 'undefined') {
          return ob.effectiveDateTime;
    } else {
      return undefined;
    }
  }


  window.drawVisualization = function(p) {
    $('#holder').show();
    $('#loading').hide();

    // var table = $("#query_table");
    //
    // table.append("<tr class = \"info\"><td>" + p.time + "</td><td>" + p.heart_rate + "</td></tr>");
    addRow(p.time, p.heart_rate);
  };

  // function of adding one single row
  function addRow(time, hr) {
    var table = $("#query_table");
    table.append("<tr class = \"info\"><td>" + time + "</td><td>" + hr + "</td></tr>");
  }

})(window);
