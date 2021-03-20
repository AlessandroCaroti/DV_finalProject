# DV_finalProject
 WebPage Berkeley Earth Temperature - DataVisualization project

 -The <strong><a href="https://github.com/AlessandroCaroti/DV_finalProject/tree/main/project"> project</a></strong> folder there is <br>
 -The <strong><a href="https://github.com/AlessandroCaroti/DV_finalProject/tree/main/data"> data</a></strong> folder contain all the data needed for the page<br>
 -In the <strong><a href="https://github.com/AlessandroCaroti/DV_finalProject/tree/main/download_data"> download_data</a></strong> folder there is the code that allow to download and reorganize the row data from the <a href="http://berkeleyearth.org/">Berkeley website</a>.<br>
<br/>
### Execution:
- Execute with server the main html: <i> index.html </i>.
- if the laptop has a screen of 13'', reduce the zoom of the page to 75%.

<br/> 

In the folder <b> project </b> there is the file <i> index.html </i> that is the html of the webpage, with the corresponding style, contained in the file <i> style.css</i>. The file <i> InitPage.js </i> and <i>eventsPages.js</i> contain respetively the function to inizialiaze all the elements in the webpage and the main events of the page. Instaead left_bar.css is the style for the side bar, and loader.css is the style for the loading page.
<br/> <br/>
The folder <b> map </b> containts all the javascript files which implement the map with all the relative features. <i>color_scale.js</i> containts the function for the map's colors, <i> map_btn.js </i> implements the map's buttons, instead the menu of the map is implemented in <i>menu_map.js</i>. All then events and and the main function of the map (plot, update...etc) are in <i> script.js</i>. The implementation of the dropdown menu to select a country is in <i>select_country.js</i>, instead the slider and the events for the choise of the years range are implemented in <i> slider.js </i> and in <i> leftSide_bar.js </i>

<br/>
The folder <b> Charts </b> containts the javascript files which implement the other charts:
<ul>
    <li> The linechart for the <a href="https://github.com/AlessandroCaroti/DV_finalProject/blob/main/project/Charts/climateChangesLinechart.js"> climate changes </a>; </li>
    <li> The <a href="https://github.com/AlessandroCaroti/DV_finalProject/blob/main/project/Charts/climateStripes.js"> climate stripes </a>; </li>
    <li> The <a href="https://github.com/AlessandroCaroti/DV_finalProject/blob/main/project/Charts/meanRateOfChangesTable.js"> mean rate of changes table </a>;</li>
    <li> The group of linecharts for the <a href="https://github.com/AlessandroCaroti/DV_finalProject/blob/main/project/Charts/anomaliesRecords.js"> anomalies record </a>;</li>
    <li> The linechart of <a href="https://github.com/AlessandroCaroti/DV_finalProject/blob/main/project/Charts/anomaliesRecords.js"> seasonal changes</a>;</li>
</ul>
Then, in the file <i> support_charts.js </i> there are all the function to load all the chart and update them whenever the data changes. <i> UltilsCharts.js</i> contains the common utility function for all the charts.


<br/> 
<br/>


<b>Contributors:</b>
<ul>
 <li><a href="https://github.com/AlessandroCaroti">Alessandro Caroti</a></li>
 <li><a href="https://github.com/simocampi">Simone Campisi</del></a></li>
 <li><a href="https://github.com/LazyRacc00n"><del>Jacopo Dapueto</a></li>
</ul>
