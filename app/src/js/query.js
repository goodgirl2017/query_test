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

        var startDay = $('#start').val();
        var endDay =$('#end').val();
        
        var obv = smart.patient.api.fetchAll({
                    type: 'Observation',
                    query: {
                      code: {
                        $or: ['http://loinc.org|8867-4']
                      },

                      date: {
                        $and: ['ge'.concat(startDay), 'le'.concat(endDay)]
                      }

                    }
                  });

        // window.alert("here");}
        $.when(pt, obv).fail(onError);

        $.when(pt, obv).done(function(patient, obv) {
          var byCodes = smart.byCodes(obv, 'code');

          var heart_rate = byCodes('8867-4');

          var p = defaultPatient();
          p.heart_rate = getQuantityValue(heart_rate[0]);
          p.time = getDateValue(heart_rate[0]);
          // p.heart_rate = getHeartRates(heart_rate);
          // p.time = getTimes(heart_rate);

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

  // function defaultPatient(){
  //   return {
  //     heart_rate: {value: []},
  //     time: {value: []},
  //   };
  // }

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
    var rates = [];
    obv.forEach(function(observation){
      rates.push(getQuantityValue(observation[0]));

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
    var times = [];
    obv.forEach(function(observation){
      times.push(getDateValue(observation[0]));

    });

    return times;
  };


  window.drawVisualization = function(p) {
    $('#holder').show();
    $('#loading').hide();

    addRow(p.time, p.heart_rate);
  };

  // function of adding one single row
  function addRow(time, hr) {
    var table = $("#query_table");
    table.append("<tr class = \"info\"><td>" + time + "</td><td>" + hr + "</td></tr>");
  }

})(window);
