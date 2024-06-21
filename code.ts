figma.showUI(__html__);

figma.ui.resize(320,280);

//MISC
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const weathericons = ["⛈️","🌦️","🌧️","❄️","🌨️","🌤️","⛅"];

figma.ui.onmessage = async(pluginMessage) => {

  if(pluginMessage.error === true){
    figma.closePlugin();
  }

  //LOADING FONTS
  await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Light" });
  await figma.loadFontAsync({ family: "Inter", style: "Extra Light" });
  await figma.loadFontAsync({ family: "Inter", style: "Black" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  await figma.loadFontAsync({ family: "Dosis", style: "Medium" });

  const nodes: SceneNode[] = [];

  //FRAME
  const frame = figma.createFrame();
  frame.resize(414, 151);
  frame.cornerRadius = 10;
  frame.name = 'RealWeather';

  //RECTANGLE
  const card = figma.createRectangle();
  card.resize(414, 151);
  card.cornerRadius = 10;

  const classic = figma.util.rgb('3A7BD5');
  const light = figma.util.rgb('536976');
  const dark = figma.util.rgb('292E49');

  switch(pluginMessage.cardVariant) {
    case "1":
      card.fills = [{type: 'SOLID', color: classic}];
      break;
    case "2":
      card.fills = [{type: 'SOLID', color: light}];
      break;
    case "3":
      card.fills = [{type: 'SOLID', color: dark}];
      break;
  }

  //TEMPERATURE TEXT
  const text = figma.createText();
  text.fontName = { family: "Inter", style: "Semi Bold" };

  if(Math.round(pluginMessage.weathertemp).toString().length === 1) {
    text.characters = "0" + Math.round(pluginMessage.weathertemp).toString();
  } else {
    text.characters = Math.round(pluginMessage.weathertemp).toString();
  }

  text.x = 35;
  text.y = 32;
  text.fontSize = 72;
  text.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  text.effects = [{
    type: 'DROP_SHADOW',
    color: {r: 0, g: 0, b: 0, a: 0.1},
    offset: { x: 0, y: 4},
    radius: 4,
    blendMode: 'NORMAL',
    visible: true
  }];
  
  //DEGREE ELLIPSE
  const circle = figma.createEllipse();
  circle.resize(13.5,13.5);
  circle.x = 130;
  circle.y = 48;
  circle.strokeWeight = 3;
  circle.strokeAlign = 'INSIDE';
  circle.strokes = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1} }];
  circle.effects = [{
    type: 'DROP_SHADOW',
    color: {r: 0, g: 0, b: 0, a: 0.1},
    offset: { x: 0, y: 4},
    radius: 4,
    blendMode: 'NORMAL',
    visible: true
    }];

  switch(pluginMessage.cardVariant) {
    case "1":
      circle.fills = [{type: 'SOLID', color: classic}];
      break;
    case "2":
      circle.fills = [{type: 'SOLID', color: light}];
      break;
    case "3":
      circle.fills = [{type: 'SOLID', color: dark}];
      break;
  }

  //DEGREE TEXT
  const celsius = figma.createText();
  celsius.fontName = { family: "Dosis", style: "Medium" };
  celsius.characters = "C";
  celsius.x = 128;
  celsius.y = 53;
  celsius.fontSize = 48;
  celsius.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  celsius.effects = [{
    type: 'DROP_SHADOW',
    color: {r: 0, g: 0, b: 0, a: 0.1},
    offset: { x: 0, y: 4},
    radius: 4,
    blendMode: 'NORMAL',
    visible: true
  }];

  const d = new Date();
  let today = weekday[d.getDay()];
  let month = months[d.getMonth()];

  //DAY TEXT
  const day = figma.createText();
  day.fontName = { family: "Inter", style: "Bold" };
  
  if(d.getDay().toString().length === 1) {
    day.characters = today + ", 0" + d.getDay() + " " + month;
  } else {
    day.characters = today + ", " + d.getDay() + month;
  }

  day.x = 170;
  day.y = 45;
  day.fontSize = 16;
  day.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];

  //CITY TEXT
  function titleCase(str: string) {
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }

  function country2flag(countryCode: string): string {
    return countryCode
        .toUpperCase()
        .split('')
        .map(char => String.fromCodePoint(char.charCodeAt(0) + 0x1F1A5))
        .join('');
  }
  
  const place = figma.createText();
  place.fontName = {family: "Inter", style: "Medium" };
  place.characters = country2flag(pluginMessage.country)+ "  " + titleCase(pluginMessage.city);
  place.x = 170;
  place.y = 68;
  place.fontSize = 14;
  place.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];

  //WEATHER TEXT
  const weather = figma.createText();
  weather.fontName = {family: "Inter", style: "Extra Light" };

  if(pluginMessage.weatherdata.includes("thunderstorm")){
    weather.characters = weathericons[0] + "   " + titleCase(pluginMessage.weatherdata);  
  } else if(pluginMessage.weatherdata.includes("drizzle")) {
    weather.characters = weathericons[1] + "   " + titleCase(pluginMessage.weatherdata); 
  } else if(pluginMessage.weatherdata.includes("rain")) {
    weather.characters = weathericons[2] + "   " + titleCase(pluginMessage.weatherdata); 
  } else if(pluginMessage.weatherdata.includes("snow")) {
    weather.characters = weathericons[3] + "   " + titleCase(pluginMessage.weatherdata); 
  } else if(pluginMessage.weatherdata.includes("sleet")) {
    weather.characters = weathericons[4] + "   " + titleCase(pluginMessage.weatherdata); 
  } else if(pluginMessage.weatherdata.includes("clear")) {
    weather.characters = weathericons[5] + "   " + titleCase(pluginMessage.weatherdata); 
  } else if(pluginMessage.weatherdata.includes("clouds")) {
    weather.characters = weathericons[6] + "   " + titleCase(pluginMessage.weatherdata); 
  } else {
    weather.characters = "🌫️   " + titleCase(pluginMessage.weatherdata);
  }

  weather.x = 170;
  weather.y = 90;
  weather.fontSize = 12;
  weather.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];

  //CORNER DESIGN
  const core = figma.createEllipse();
  core.resize(92,92);
  core.x = 345;
  core.y = -23;
  core.fills = [{ type: 'SOLID', color: { r: 0.988, g: 0.898, b: 0.533 } }];

  const shine1 = figma.createEllipse();
  shine1.resize(135,135);
  shine1.x = 323;
  shine1.y = -46;
  shine1.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  shine1.opacity = 0.15;

  const shine2 = figma.createEllipse();
  shine2.resize(172,172);
  shine2.x = 305;
  shine2.y = -64;
  shine2.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  shine2.opacity = 0.1;
  
  //GROUP
  frame.appendChild(card);

  frame.appendChild(text);
  frame.appendChild(circle);
  frame.appendChild(celsius);
  figma.group([text,circle,celsius], frame).name = "Temperature";

  frame.appendChild(day);
  frame.appendChild(place);
  frame.appendChild(weather);
  figma.group([day,place,weather], frame).name = "Details";

  frame.appendChild(shine2);
  frame.appendChild(shine1);
  frame.appendChild(core);
  figma.group([shine2,shine1,core], frame).name = "Design";

  nodes.push(frame);
  figma.viewport.scrollAndZoomIntoView(nodes);

  figma.closePlugin();
}
