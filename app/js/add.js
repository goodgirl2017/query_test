
function addPatient(){

    var username=$('#username').val();
    var password=$('#password').val();

    if (username !== null && password !== null){

        var jsonBody={};
        jsonBody.userName=username;
        jsonBody.password=password;
        jsonBody = JSON.stringify(jsonBody);

        $.ajax({
            type: "POST",
            url: '../api/authentication',
            data: jsonBody,
            headers: { 'User': jsonBody },
            dataType: 'json',
            contentType: "application/json",
			//success- jump to main.html
            success:function(data) {
                console.log(data.token);
                window.location.href = "main.html?userId="+data.token;
            }
        });

    }
}

function addObservation(){

    var username=$('#username').val();
    var password=$('#password').val();

    if (username !== null && password !== null){

        var jsonBody={};
        jsonBody.userName=username;
        jsonBody.password=password;
        jsonBody = JSON.stringify(jsonBody);

        $.ajax({
            type: "POST",
            url: '../api/authentication',
            data: jsonBody,
            headers: { 'User': jsonBody },
            dataType: 'json',
            contentType: "application/json",
			//success- jump to main.html
            success:function(data) {
                console.log(data.token);
                window.location.href = "main.html?userId="+data.token;
            }
        });

    }
}

// Create a FHIR client (server URL, patient id in `demo`)
var smart = FHIR.client(demo),
    pt = smart.patient;

// Create a patient banner by fetching + rendering demographics
smart.patient.read().then(function(pt) {
  displayPatient (pt);
});

// A more advanced query: search for active Prescriptions, including med details
smart.patient.api.fetchAllWithReferences({type: "MedicationOrder"},["MedicationOrder.medicationReference"]).then(function(results, refs) {
   results.forEach(function(prescription){
        if (prescription.medicationCodeableConcept) {
            displayMedication(prescription.medicationCodeableConcept.coding);
        } else if (prescription.medicationReference) {
            var med = refs(prescription, prescription.medicationReference);
            displayMedication(med && med.code.coding || []);
        }
   });
});

function getPatientName (pt) {
  if (pt.name) {
    var names = pt.name.map(function(name) {
      return name.given.join(" ") + " " + name.family.join(" ");
    });
    return names.join(" / ")
  } else {
    return "anonymous";
  }
}

function getMedicationName (medCodings) {
  var coding = medCodings.find(function(c){
    return c.system == "http://www.nlm.nih.gov/research/umls/rxnorm";
  });

  return coding && coding.display || "Unnamed Medication(TM)"
}

var med_list = document.getElementById('med_list');

function displayPatient (pt) {
  document.getElementById('patient_name').innerHTML = getPatientName(pt);
}

function displayMedication (medCodings) {
  med_list.innerHTML += "<li> " + getMedicationName(medCodings) + "</li>";
}
