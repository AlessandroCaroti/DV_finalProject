# Data Visualization: Final Project

WebPage Berkeley Earth Temperature - Data Visualization project

### Execution:
- Execute a server with <i> index.html </i> as main html.
- If the laptop has a screen of 13'', reduce the zoom of the page to 75%.
<br/>

### Folder Structure:

 - In the <strong><a href="https://github.com/AlessandroCaroti/DV_finalProject/tree/main/project"> project</a></strong> folder there is the file <i> index.html </i> that is the html of the webpage, with the corresponding style, contained in the file <i> style.css</i>. The file <i> InitPage.js </i> and <i>eventsPages.js</i> contain respetively the function to inizialize all the elements in the webpage and the main events of the page. Instead left_bar.css is the style of the side bar, and loader.css is the style for the loading page. 
 - The <strong><a href="https://github.com/AlessandroCaroti/DV_finalProject/tree/main/data"> data</a></strong> folder contain all the data needed for the application.<br>
 - In the <strong><a href="https://github.com/AlessandroCaroti/DV_finalProject/tree/main/download_data"> download_data</a></strong> folder there is the code that allow to download and reorganize the raw data from the <a href="http://berkeleyearth.org/">Berkeley website</a>.<br>
<br/>

<br/> 
The folder <b> map </b> contains all the javascript files which implement the map with all the relative features. <i>color_scale.js</i> contains the functions for the color scale and the legend, <i> map_btn.js </i> implements the map's buttons, instead the menu of the map is implemented in <i>menu_map.js</i>. All then events and and the main function of the map (plot, update...etc) are in <i> script.js</i>. The implementation of the dropdown menu to select a country is in <i>select_country.js</i>, instead the slider and the events for the choise of the years range are implemented in <i> slider.js </i> and in <i> leftSide_bar.js </i>

<br/><br/>
The folder <b> Charts </b> containts the javascript files which implement the other charts:
<ul>
    <li> The linechart for the <a href="https://github.com/AlessandroCaroti/DV_finalProject/blob/main/project/Charts/climateChangesLinechart.js"> climate changes</a>; </li>
    <li> The <a href="https://github.com/AlessandroCaroti/DV_finalProject/blob/main/project/Charts/climateStripes.js"> climate stripes</a>; </li>
    <li> The <a href="https://github.com/AlessandroCaroti/DV_finalProject/blob/main/project/Charts/meanRateOfChangesTable.js"> mean rate of changes table</a>;</li>
    <li> The group of linecharts for the <a href="https://github.com/AlessandroCaroti/DV_finalProject/blob/main/project/Charts/anomaliesRecords.js"> anomalies record</a>;</li>
    <li> The linechart of <a href="https://github.com/AlessandroCaroti/DV_finalProject/blob/main/project/Charts/anomaliesRecords.js"> seasonal changes</a>.</li>
</ul>
Then, in the file <i> support_charts.js </i> there are all the function to load all the chart and update them whenever the data changes. <i> UltilsCharts.js</i> contains the common utility function for all the charts.


<br/> 
<br/>

Is possible to view the webpage <a href="http://rmplst.me/project/"> here (not always available) </a>.

<b>Contributors:</b>
<ul>
 <li><a href="https://github.com/AlessandroCaroti">Alessandro Caroti</a></li>
 <li><a href="https://github.com/simocampi">Simone Campisi</del></a></li>
 <li><a href="https://github.com/LazyRacc00n">Jacopo Dapueto</a></li>
</ul>
