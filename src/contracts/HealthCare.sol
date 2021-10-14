pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;
contract HealthCare {
  address private owner;
  uint public medecinCount = 0;
  mapping (address => doctor) private doctors;// doctor and list of patient profile he can access
  mapping (address => mapping(address => uint)) private doctorToPatient;
  mapping (address => patient) private patients;
  mapping (address => mapping (address => uint)) private patientToDoctor;
  mapping (string => filesInfo) private hashToFile; //filehash to file info
  mapping (address => mapping (string => uint)) private patientToFile;
  uint private gpos;
  
  struct filesInfo {
      string file_name;
      string file_type;
      address added_by;
      
  }
  
  struct patient {
      string fname;
      string lname;
      uint8 age;
      address id;
      string[] files;
      address[] doctor_list;
      uint32 ph_num;
      string [] diagnosis;
      uint addmission_date;
      int256 [] temperature;
      int256 [] humidity;
  }
  
  struct doctor {
      string fname;
      string lname;
      address id;
      uint licenceId;
      uint32 ph_num;
      address[] patient_list;
  }
  
  constructor() public {
    owner = msg.sender;
  }
  
  modifier checkDoctor(address id) {
    doctor memory d = doctors[id];
    require(d.id > address(0x0));//check if doctor exist
    _;
  }
  
  modifier checkPatient(address id) {
    patient memory p = patients[id];
    require(p.id > address(0x0));//check if patient exist
    _;
  }
  
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }
  
  modifier checkFileAccess(string memory role, address id, string memory fileHashId, address pat) {
    uint pos;
    if(keccak256(abi.encodePacked(role)) == keccak256("doctor")) {
        require(patientToDoctor[pat][id] > 0);
        pos = patientToFile[pat][fileHashId];
        require(pos > 0);   
    }
    else if(keccak256(abi.encodePacked(role)) == keccak256("patient")) {
        pos = patientToFile[id][fileHashId];
        require(pos > 0);
    }
    _; 
  }
  

//function for patient
  function signupPatient(string memory _fname,string memory _lname, uint8 _age, uint32 _ph_num ) public {
     patient storage p = patients[msg.sender];
     require(keccak256(abi.encodePacked(_fname)) != keccak256(""));
     require((_age > 0) && (_age < 100));
     require(!(p.id > address(0x0)));
     patients[msg.sender] = patient({fname:_fname,lname:_lname,age:_age,id:msg.sender,ph_num:_ph_num,files:new string[](0),doctor_list:new address[](0),diagnosis:new string[](0),addmission_date:block.timestamp, temperature:new int256[](0),humidity:new int256[](0)});
  }
 //function for doctor 
  function signupDoctor(string memory _fname,string memory _lname, uint8 _licenceId, uint32 _ph_num ) public {
      doctor storage d = doctors[msg.sender];
      require(keccak256(abi.encodePacked(_fname)) != keccak256(""));
      require(!(d.id > address(0x0)));
      doctors[msg.sender] = doctor({fname:_fname,lname:_lname,id:msg.sender,licenceId:_licenceId,ph_num:_ph_num,patient_list:new address[](0)});
      medecinCount ++;
  }
 //function for patient 
  function grantAccessToDoctor(address doctor_id) public checkPatient(msg.sender) checkDoctor(doctor_id) {
      patient storage p = patients[msg.sender];
      doctor storage d = doctors[doctor_id];
      p.doctor_list.push(doctor_id);// new length of array
      uint pos = p.doctor_list.length - 1;
      gpos = pos;
      patientToDoctor[msg.sender][doctor_id] = pos;
      d.patient_list.push(msg.sender);
  }
 //function for doctor 
  function addFile_byDc(string memory _file_name, string memory _file_type, string memory _fileHash, address _patient_Id) public checkDoctor(msg.sender) {
      patient storage p = patients[_patient_Id];
      require(patientToFile[_patient_Id][_fileHash] < 1);
      hashToFile[_fileHash] = filesInfo({file_name:_file_name, file_type:_file_type, added_by:_patient_Id});
      p.files.push(_fileHash);// new length of array
      uint pos = p.files.length - 1;
      patientToFile[_patient_Id][_fileHash] = pos;
  }
//function for patient
  function addFile_byPt(string memory _file_name, string memory _file_type, string memory _fileHash) public checkPatient(msg.sender) {
      patient storage p = patients[msg.sender];
      require(patientToFile[msg.sender][_fileHash] < 1);
      hashToFile[_fileHash] = filesInfo({file_name:_file_name, file_type:_file_type, added_by:msg.sender});
      p.files.push(_fileHash);// new length of array
      uint pos = p.files.length - 1;
      patientToFile[msg.sender][_fileHash] = pos;
  }
//function for patient
  function setData(int256  _humidity, int256  _temperature) public checkPatient(msg.sender) {
      patient storage p = patients[msg.sender];
      require(p.id > address(0x0));
      p.humidity.push(_humidity);
      p.temperature.push(_temperature);
  }  
//function for patient    
  function getPatientInfoForPatient() public view checkPatient(msg.sender) returns(string memory,string memory, uint8, string[] memory , address[] memory, int256[] memory, int256[] memory) {
      patient memory p = patients[msg.sender];
      return (p.fname,p.lname, p.age, p.files, p.doctor_list,p.temperature,p.humidity);
  }
  //function for doctor
  function getDoctorInfo() public view checkDoctor(msg.sender) returns(string memory,string memory, address[] memory){
      doctor memory d = doctors[msg.sender];
      return (d.fname,d.lname, d.patient_list);
  }
  //function for patient
  function checkProfile(address _user) public view returns(string memory, string memory){
      patient memory p = patients[_user];
      doctor memory d = doctors[_user];
      
      if(p.id > address(0x0))
          return (p.fname, 'patient');
      else if(d.id > address(0x0))
          return (d.fname, 'doctor');
      else
          return ('', '');
  }
  //function for doctor
  function getPatientInfoForDoctor() public view checkDoctor(msg.sender) returns(string memory,string memory, uint8, address, string[] memory, int256[] memory, int256[] memory){
      patient memory p = patients[msg.sender];
      return (p.fname,p.lname, p.age, p.id, p.files , p.temperature, p.humidity);
  }
  

  
}