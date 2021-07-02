## Classes

<dl>
<dt><a href="#Magpie">Magpie</a></dt>
<dd></dd>
<dt><a href="#Socket">Socket</a></dt>
<dd></dd>
<dt><a href="#Mousetracking">Mousetracking</a></dt>
<dd></dd>
<dt><a href="#Eyetracking">Eyetracking</a></dt>
<dd></dd>
</dl>

<a name="Magpie"></a>

## Magpie
**Kind**: global class  

* [Magpie](#Magpie)
    * [new Magpie()](#new_Magpie_new)
    * [.validators](#Magpie+validators) : <code>object</code>
    * [.v](#Magpie+v) : <code>object</code>
    * [.id](#Magpie+id) : <code>string</code>
    * [.serverUrl](#Magpie+serverUrl) : <code>string</code>
    * [.submissionUrl](#Magpie+submissionUrl) : <code>string</code>
    * [.submissionUrl](#Magpie+submissionUrl) : <code>string</code>
    * [.contactEmail](#Magpie+contactEmail) : <code>string</code>
    * [.mode](#Magpie+mode) : <code>string</code>
    * [.contactEmail](#Magpie+contactEmail) : <code>boolean</code>
    * [.socket](#Magpie+socket) : [<code>Socket</code>](#Socket)
    * [.mousetracking](#Magpie+mousetracking) : [<code>Mousetracking</code>](#Mousetracking)
    * [.eyetracking](#Magpie+eyetracking) : [<code>Eyetracking</code>](#Eyetracking)
    * [.currentScreenIndex](#Magpie+currentScreenIndex) : <code>number</code>
    * [.currentSlideIndex](#Magpie+currentSlideIndex) : <code>number</code>
    * [.responseTimeStart](#Magpie+responseTimeStart) : <code>number</code>
    * [.measurements](#Magpie+measurements) : <code>object</code>
    * [.validateMeasurements](#Magpie+validateMeasurements) : <code>object</code>
    * [.timers](#Magpie+timers) : <code>object</code>
    * [.nextSlide(index)](#Magpie+nextSlide)
    * [.nextScreen(index)](#Magpie+nextScreen)
    * [.saveAndNextScreen(index)](#Magpie+saveAndNextScreen)
    * [.addTrialData(data)](#Magpie+addTrialData)
    * [.addExpData(data)](#Magpie+addExpData)
    * [.getAllData()](#Magpie+getAllData) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.submit()](#Magpie+submit) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.submitIntermediateResults()](#Magpie+submitIntermediateResults) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.setProgress(percentage)](#Magpie+setProgress)

<a name="new_Magpie_new"></a>

### new Magpie()
Magpie specific vue tools exposed as $magpie

<a name="Magpie+validators"></a>

### magpie.validators : <code>object</code>
Gives easy access to validators. Validation is based on [vuelidate](https://vuelidate.js.org). These are [the built-in validators](https://vuelidate.js.org/#sub-builtin-validators)

**Kind**: instance property of [<code>Magpie</code>](#Magpie)  
<a name="Magpie+v"></a>

### magpie.v : <code>object</code>
Shorthand for $magpie.validators

**Kind**: instance property of [<code>Magpie</code>](#Magpie)  
<a name="Magpie+id"></a>

### magpie.id : <code>string</code>
The ID of the experiment

**Kind**: instance property of [<code>Magpie</code>](#Magpie)  
<a name="Magpie+serverUrl"></a>

### magpie.serverUrl : <code>string</code>
**Kind**: instance property of [<code>Magpie</code>](#Magpie)  
<a name="Magpie+submissionUrl"></a>

### magpie.submissionUrl : <code>string</code>
**Kind**: instance property of [<code>Magpie</code>](#Magpie)  
<a name="Magpie+submissionUrl"></a>

### magpie.submissionUrl : <code>string</code>
**Kind**: instance property of [<code>Magpie</code>](#Magpie)  
<a name="Magpie+contactEmail"></a>

### magpie.contactEmail : <code>string</code>
**Kind**: instance property of [<code>Magpie</code>](#Magpie)  
<a name="Magpie+mode"></a>

### magpie.mode : <code>string</code>
**Kind**: instance property of [<code>Magpie</code>](#Magpie)  
<a name="Magpie+contactEmail"></a>

### magpie.contactEmail : <code>boolean</code>
**Kind**: instance property of [<code>Magpie</code>](#Magpie)  
<a name="Magpie+socket"></a>

### magpie.socket : [<code>Socket</code>](#Socket)
**Kind**: instance property of [<code>Magpie</code>](#Magpie)  
<a name="Magpie+mousetracking"></a>

### magpie.mousetracking : [<code>Mousetracking</code>](#Mousetracking)
**Kind**: instance property of [<code>Magpie</code>](#Magpie)  
<a name="Magpie+eyetracking"></a>

### magpie.eyetracking : [<code>Eyetracking</code>](#Eyetracking)
**Kind**: instance property of [<code>Magpie</code>](#Magpie)  
<a name="Magpie+currentScreenIndex"></a>

### magpie.currentScreenIndex : <code>number</code>
The id of the current screen

**Kind**: instance property of [<code>Magpie</code>](#Magpie)  
<a name="Magpie+currentSlideIndex"></a>

### magpie.currentSlideIndex : <code>number</code>
The id of the current slide

**Kind**: instance property of [<code>Magpie</code>](#Magpie)  
<a name="Magpie+responseTimeStart"></a>

### magpie.responseTimeStart : <code>number</code>
The start time of the response_time measurement

**Kind**: instance property of [<code>Magpie</code>](#Magpie)  
<a name="Magpie+measurements"></a>

### magpie.measurements : <code>object</code>
The measurements of the current screen. All data in this object
can be saved using $magpie.saveMeasurements

**Kind**: instance property of [<code>Magpie</code>](#Magpie)  
<a name="Magpie+validateMeasurements"></a>

### magpie.validateMeasurements : <code>object</code>
Validation results on the current measurements

**Kind**: instance property of [<code>Magpie</code>](#Magpie)  
<a name="Magpie+timers"></a>

### magpie.timers : <code>object</code>
A hash of timer start points by id

**Kind**: instance property of [<code>Magpie</code>](#Magpie)  
<a name="Magpie+nextSlide"></a>

### magpie.nextSlide(index)
Go to the next slide.

**Kind**: instance method of [<code>Magpie</code>](#Magpie)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>int</code> | the index of the slide to go to (optional; default is next slide) |

<a name="Magpie+nextScreen"></a>

### magpie.nextScreen(index)
Go to the next screen. (Will also reset scroll position.)

**Kind**: instance method of [<code>Magpie</code>](#Magpie)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>int</code> | the index of the screen to go to (optional; default is next screen) |

<a name="Magpie+saveAndNextScreen"></a>

### magpie.saveAndNextScreen(index)
SaveMeasurements and go to the next screen. (Will also reset scroll position.)

**Kind**: instance method of [<code>Magpie</code>](#Magpie)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>int</code> | the index of the screen to go to (optional; default is next screen) |

<a name="Magpie+addTrialData"></a>

### magpie.addTrialData(data)
Add a result set
This method will automatically add a response_time key to your data with time measured from the start of the current screen

**Kind**: instance method of [<code>Magpie</code>](#Magpie)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | a flat object whose data you want to add to the results |

<a name="Magpie+addExpData"></a>

### magpie.addExpData(data)
Add global facts that will be added to each result set

**Kind**: instance method of [<code>Magpie</code>](#Magpie)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | a flat object whose data you want to add to the facts |

<a name="Magpie+getAllData"></a>

### magpie.getAllData() ⇒ <code>Array.&lt;Object&gt;</code>
Returns an array of objects with all trial data that has been submitted so far, including experiment-wide data

**Kind**: instance method of [<code>Magpie</code>](#Magpie)  
**Access**: public  
<a name="Magpie+submit"></a>

### magpie.submit() ⇒ <code>Promise.&lt;void&gt;</code>
Submit all data collected so far

**Kind**: instance method of [<code>Magpie</code>](#Magpie)  
<a name="Magpie+submitIntermediateResults"></a>

### magpie.submitIntermediateResults() ⇒ <code>Promise.&lt;void&gt;</code>
Submit all data collected so far as intermediate results

**Kind**: instance method of [<code>Magpie</code>](#Magpie)  
<a name="Magpie+setProgress"></a>

### magpie.setProgress(percentage)
Set progress bar percentage
Will display a progress bar if it's not visible, yet.

**Kind**: instance method of [<code>Magpie</code>](#Magpie)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| percentage | <code>float</code> | the percentage to display as a number between 0 and 1 |

<a name="Socket"></a>

## Socket
**Kind**: global class  

* [Socket](#Socket)
    * [.participantId](#Socket+participantId) : <code>string</code>
    * [.experimentId](#Socket+experimentId) : <code>string</code>
    * [.participantId](#Socket+participantId) : <code>&#x27;CONNECTING&#x27;</code> \| <code>&#x27;CONNECTED&#x27;</code> \| <code>&#x27;WAITING&#x27;</code> \| <code>&#x27;READY&#x27;</code> \| <code>&#x27;ERROR&#x27;</code>
    * [.participants](#Socket+participants) : <code>Array.&lt;string&gt;</code>
    * [.active](#Socket+active) : <code>Array.&lt;string&gt;</code>
    * [.active](#Socket+active) : <code>Number</code>
    * [.active](#Socket+active) : <code>Number</code>
    * [.active](#Socket+active) : <code>Number</code>
    * [.getParticipantName(id)](#Socket+getParticipantName) ⇒ <code>String</code>
    * [.getParticipantColor(id)](#Socket+getParticipantColor) ⇒ <code>String</code>
    * [.initialize()](#Socket+initialize)
    * [.broadcast(event, payload)](#Socket+broadcast)

<a name="Socket+participantId"></a>

### socket.participantId : <code>string</code>
**Kind**: instance property of [<code>Socket</code>](#Socket)  
<a name="Socket+experimentId"></a>

### socket.experimentId : <code>string</code>
**Kind**: instance property of [<code>Socket</code>](#Socket)  
<a name="Socket+participantId"></a>

### socket.participantId : <code>&#x27;CONNECTING&#x27;</code> \| <code>&#x27;CONNECTED&#x27;</code> \| <code>&#x27;WAITING&#x27;</code> \| <code>&#x27;READY&#x27;</code> \| <code>&#x27;ERROR&#x27;</code>
A reactive property with the state of the socket

**Kind**: instance property of [<code>Socket</code>](#Socket)  
<a name="Socket+participants"></a>

### socket.participants : <code>Array.&lt;string&gt;</code>
A reactive list of online participants

**Kind**: instance property of [<code>Socket</code>](#Socket)  
<a name="Socket+active"></a>

### socket.active : <code>Array.&lt;string&gt;</code>
A reactive list of participants currently active in the current screen

**Kind**: instance property of [<code>Socket</code>](#Socket)  
<a name="Socket+active"></a>

### socket.active : <code>Number</code>
The variant number of this session

**Kind**: instance property of [<code>Socket</code>](#Socket)  
<a name="Socket+active"></a>

### socket.active : <code>Number</code>
The chain number of this session

**Kind**: instance property of [<code>Socket</code>](#Socket)  
<a name="Socket+active"></a>

### socket.active : <code>Number</code>
The realization number of this session

**Kind**: instance property of [<code>Socket</code>](#Socket)  
<a name="Socket+getParticipantName"></a>

### socket.getParticipantName(id) ⇒ <code>String</code>
**Kind**: instance method of [<code>Socket</code>](#Socket)  

| Param | Type |
| --- | --- |
| id | <code>String</code> | 

<a name="Socket+getParticipantColor"></a>

### socket.getParticipantColor(id) ⇒ <code>String</code>
**Kind**: instance method of [<code>Socket</code>](#Socket)  

| Param | Type |
| --- | --- |
| id | <code>String</code> | 

<a name="Socket+initialize"></a>

### socket.initialize()
Initialize the socket

**Kind**: instance method of [<code>Socket</code>](#Socket)  
<a name="Socket+broadcast"></a>

### socket.broadcast(event, payload)
**Kind**: instance method of [<code>Socket</code>](#Socket)  

| Param | Type |
| --- | --- |
| event | <code>string</code> | 
| payload |  | 

<a name="Mousetracking"></a>

## Mousetracking
**Kind**: global class  

* [Mousetracking](#Mousetracking)
    * [.start(x, y)](#Mousetracking+start)
    * [.getMouseTrack(rate)](#Mousetracking+getMouseTrack) ⇒ <code>Object</code>

<a name="Mousetracking+start"></a>

### mousetracking.start(x, y)
(re)start mouse tracking for the current screen

**Kind**: instance method of [<code>Mousetracking</code>](#Mousetracking)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | Relative Origin x coordinate |
| y | <code>Number</code> | Relative Origin y coordinate |

<a name="Mousetracking+getMouseTrack"></a>

### mousetracking.getMouseTrack(rate) ⇒ <code>Object</code>
Get the mouse track since the appearance of the current screen

**Kind**: instance method of [<code>Mousetracking</code>](#Mousetracking)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| rate | <code>int</code> | <code>15</code> | Time resolution in ms (optional; defaults to 15ms) |

<a name="Eyetracking"></a>

## Eyetracking
**Kind**: global class  

* [Eyetracking](#Eyetracking)
    * [.start(x, y)](#Eyetracking+start)
    * [.setDebug(debugging)](#Eyetracking+setDebug)
    * [.getEyeTrack(rate)](#Eyetracking+getEyeTrack) ⇒ <code>Object</code>

<a name="Eyetracking+start"></a>

### eyetracking.start(x, y)
(re)start eye tracking for the current screen

**Kind**: instance method of [<code>Eyetracking</code>](#Eyetracking)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | Relative Origin x coordinate |
| y | <code>Number</code> | Relative Origin y coordinate |

<a name="Eyetracking+setDebug"></a>

### eyetracking.setDebug(debugging)
set debugging status

**Kind**: instance method of [<code>Eyetracking</code>](#Eyetracking)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| debugging | <code>Boolean</code> | Whether to display debugging information |

<a name="Eyetracking+getEyeTrack"></a>

### eyetracking.getEyeTrack(rate) ⇒ <code>Object</code>
Get the eye gaze track since the appearance of the current screen

**Kind**: instance method of [<code>Eyetracking</code>](#Eyetracking)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| rate | <code>int</code> | <code>15</code> | Time resolution in ms (optional; defaults to 15ms) |

