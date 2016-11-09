var attackValue = 0; //External variable to store base attack value of selected hero
var wins = 0; //Wins counter to keep track of messages displayed in the #instructions div.
var flag = true; //Boolean to help determine which song is playing and which song to pause/play
var selectedHero = undefined; //Variable that's used to easily reference selected hero. 
var selectedEnemy = undefined; //Variable that's used to easily reference selected enemy.
var backgroundSong = new Audio ("assets/music/juno.mp3");//Background music
var musicBritney = new Audio("assets/music/britney.mp3"); //Britney's theme song
var musicJustin = new Audio("assets/music/justin.mp3"); //Justin's theme song
var musicNick = new Audio ("assets/music/nick.mp3"); //Nick's theme song
var musicChristina = new Audio("assets/music/christina.mp3"); //Christina's theme song
var musicArray = [musicBritney, musicJustin, musicChristina, musicNick];//Array created in order to store music in order to call on when hero is selected
var songSelection = []; //Array variable to store songs
var heroMusic = []; //Array variable to correctly call song of music

//Starts the background music.
backgroundSong.play();

//Logic that will continue to play if no character is selected. Event the window "listens" for is when the song has ended.
backgroundSong.addEventListener('ended', function(){
	//When the song ends, song's current time is set to 0 or the beginning.
	this.currentTime=0;
	//Song plays again
	backgroundSong.play();
}, false);

//Function that will loop the hero's theme song as long as you don't win, lose or reset the game
var heroMusicContinue = function() {
	//heroMusic is only defined when flag is set to false, which only occurs when the hero character is selected.
	if (flag===false){
		heroMusic.addEventListener('ended', function(){
			this.currentTime=0;
			heroMusic.play();
		}, false);
	}
}

//Object that declares all the characters, names, and attributes. Picture name is 
//to "move" the picture to the designated hero/enemy sides.
var playableCharacters = {
	britney: {
		name: "Britney",
		hp: 210,
		attack: 4,
		counterAtk: 14,
		musicValue: 0,
		pictureName: "britney.jpg"
	},
	christina: {
		name: "Christina",
		hp: 200,
		attack: 8,
		counterAtk: 14,
		musicValue: 2,
		pictureName: "christina.jpg"
	},
	nick: {
		name: "Nick",
		hp: 240,
		attack: 3,
		counterAtk: 14,
		musicValue: 3,
		pictureName: "nick.jpg"
	},
	justin: {
		name: "T-Lake",
		hp: 180,
		attack: 6,
		counterAtk: 16,
		musicValue: 1,
		pictureName: "justin.jpg"
	}
};

//Music pause/play button
$( "#musicPause" ).on('click', function(){
	//When the app first runs, a background song gets played, and the pause button only pauses or
	//plays the background song. var flag = true declared in the global variables. When user selects 
	//hero, flag = false, and the pause button will only work in the next if statement. When user 
	//wins or loses or resets the game, flag is reset to true. 
	if (flag===true){
		//If background song is not paused (ie, playing), then pause
		if (!backgroundSong.paused){
			backgroundSong.pause();
		//Likewise, if background song is paused, pause button will play it
		} else if (backgroundSong.paused){
			backgroundSong.play();
		}	
	}
	//Once a character is selected as a hero, flag is set to false, and therefore the pause button only plays/pauses the hero's theme music.
	if (flag===false){
		//Test to see if condition heroMusic is not paused (ie, playing), then pause button would pause the song. 
		if (!heroMusic.paused){
			heroMusic.pause(); //If playing, then pauses.
		} else if (heroMusic.paused){
			heroMusic.play(); //If paused, then plays.
		}
	}
});

//Selecting your hero and enemy
$( ".character").on('click', function(){
	//First click selects your hero character and moves him/her to the designated hero area on the left side. Also, instructions change and display upon each click.
	if (selectedHero===undefined){
		$( this ).addClass("selectedHero");
		$( this ).addClass("hidden");
		$( "#fightLog" ).html("");
		var holder = $(this).attr("id");
		selectedHero = playableCharacters[holder];
		$( "#heroArea" ).html('<img src="assets/images/' + selectedHero.pictureName + '" />');
		console.log('<img src="assets/images/' + selectedHero.pictureName + '"/>');
		attackValue = selectedHero.attack;
		$( "#heroAnnouncement" ).html("<h4>Your selected hero is</h4>");
		$( "#instructions" ).html("<h3>Choose your nemesis</h3>");
		//Pauses current background music.
		backgroundSong.pause();
		//Effectively "stops" the song.
		backgroundSong.currentTime = 0;
		//Song of associated with your selected hero will start playing.
		heroMusic= musicArray[selectedHero.musicValue];
		heroMusic.play();
		flag = false;
		heroMusicContinue();
	//Second click selects who the enemy and moves him/her to the right side
	} else if (selectedEnemy===undefined && selectedHero !== undefined){
		//SelectedEnemy class to manipulate DOM based on class
		$( this ).addClass("selectedEnemy")
		//Added class "hidden" to display: none (from CSS) that picture from the 
		//select characters area. That way it cannot be reselected until the game
		//is reset.
		$( this ).addClass("hidden");
		//creating holder variable to more easily reference the #id of the clicked
		//picture's tag.  
		var holder = $( this ).attr("id");
		//Setting selectedEnemy variable to the object playableCharacters.holder where
		//"holder" is the name of the #id of the tag as well as the name of the object key
		//which allows us to access that character's key/value pairs using . notationg
		selectedEnemy = playableCharacters[holder];
		//Using the manipulation described above,by now having a simple way to reference 
		//selectedEnemy's picture name, I can specifically call that picture (by also naming the
		//picture the name of the person.jpg)
		$( "#enemyArea" ).html('<img src="assets/images/' + selectedEnemy.pictureName + '" />');
		//An announcement that declares your selection of an enemy
		$( "#enemyAnnouncement" ).html("<h4>Your selected enemy is</h4>");
		$( "#instructions" ).html("<h3>Now click sing to see which star reigns supreme!</h3>");
		$( "#fightLog" ).html("");
	}
});

//When character has a mouse over it, it will fade in and out, and display attack and hp stats in the header
$( ".character" ).on('mouseover', function(){
	$( this ).fadeOut( 300 );
	$( this ).fadeIn( 500 );
	//"$(this).attr("id") to designate the varaible value of holder to the id of the tag in the HTML, 
	//which corresponds with the object name of the character, which allows me to easily access his/her stats
	if (selectedHero == undefined) {
		//Instruction of choosing hero only happens upon mouseover when condition selected hero is not defined yet.
		$( "#instructions" ).html("<h3>Choose your hero</h3>");
	} else if (selectedHero !== undefined && selectedEnemy == undefined) {
		//Once hero is defined, and enemy is not, the mouseover condition will display instructions to choose your nemesis
		$( "#instructions" ).html("<h3>Choose your nemesis</h3>");
		//If there's a character (or 2) left to be chosen, but the hero is dead, then the message when the character 
		//is moused over will read "try again" 
	} else if (selectedHero.hp < 1) {
		$( "#instructions" ).html("<h2>You suck. You got served. Try again!</h2>");
		//If hero wins and has characters remaining to be selected, the following displays.
	} else if (selectedEnemy.hp < 1 && selectedHero.hp > 0) {
		$( "#instructions" ).html("<h3>CONGRATULATIONS, YOU HAVE SERVED EVERYONE. CLICK RESET TO TRY AGAIN</h3>");
		//The other condition would be for both the hero and enemy to be defined and for the sing attacking to begin.		
	} else {
		$( "#instructions" ).html("<h3>Click sing to start the bloodbath!</h3>");
	};
	var holder = $( this ).attr("id");
	var characterInfo = playableCharacters[holder];
	$( "#statsArea" ).html(characterInfo.name + " has " + characterInfo.hp + "HP and " + characterInfo.attack + " Singing Power");
});

//When user moves mouse away from the selectable characters area, the following messages are displayed to prevent the header from collapsing 
$( ".character" ).on('mouseleave', function(){
	var holder = $(this).attr("id");
	var characterInfo = playableCharacters[holder];
	$( "#statsArea" ).html("Battle using the hottest stars circa 1997");
});

var whoIsDead = function() {
	fightResults();
	if (wins < 3){
		if (selectedHero.hp < 1){
			$( "#instructions" ).html("<h2>You suck. You got served. Click reset try again!</h2>");
			$( "#fightLog").html("Oh no! " + selectedHero.name + " has 0 HP left! Try again");
			reset();
		} else if (selectedEnemy.hp < 1 && selectedHero.hp > 0){
			$( "#instructions" ).html("<h2>Good job. You served " + selectedEnemy.name + "! Select your next enemy to fight!</h2>");
			$( "#fightLog" ).html(selectedEnemy.name + " has 0 HP left!");
			$( "#enemyArea" ).html("");
			$( "#enemyAnnouncement" ).html("");
			selectedEnemy = undefined;
			wins++;
		} else {
			fightResults();
		}
	}

	if (wins===3){
		$( "#instructions" ).html("<h3>CONGRATULATIONS, YOU HAVE SERVED EVERYONE. CLICK RESET TO TRY AGAIN</h3>");
		$( "#fightLog" ).html(selectedEnemy.name + " has 0 HP left!");
	}
};

//If both characters are alive, then the results of each attack/counterattack/hp stats gets displayed
var fightResults = function() {
	$( "#fightLog" ).html(selectedHero.name + " sang at " + selectedEnemy.name + " and served " + selectedHero.attack + " damage! " + selectedEnemy.name + " has " + selectedEnemy.hp + " health left. " + selectedEnemy.name + " countered and served back " + selectedEnemy.counterAtk + " singing damage back at " + selectedHero.name + "! " + selectedHero.name + " has " + selectedHero.hp + " health left.");
};


$( "#fight" ).on("click", function(){
	if (selectedHero !== undefined && selectedEnemy !== undefined){
		//Hero attacks enemy for attack power value and decreases HP of enemy by amount
		selectedEnemy.hp -= selectedHero.attack;
		//Hero sustains counter attack damage and HP is reduced by enemy's counter attack value
		selectedHero.hp -= selectedEnemy.counterAtk;
		//Display results of fight action
		whoIsDead();
		//Hero's attack strength increase by its base amount each time. This was declared during the character selection process.
		selectedHero.attack += attackValue;
	}
});

//Button action that resets game to start conditions
$( "#reset" ).on("click", function(){
	reset();
});

//Function that resets game to start conditions
function reset() {
	attackValue = 0;
	wins = 0; 
	flag = true; 
	selectedHero = undefined; 
	selectedEnemy = undefined; 
	//If user resets while hero's theme song is playing, then 
	//song pauses and resets to the beginning, so if selected again
	//song starts from the beginning and doesn't pick up from 
	//where it left off
	heroMusic.pause();
	heroMusic.currentTime=0;
	backgroundSong.play();
	flag = true;
	$( "#heroArea" ).html("");
	$( "#heroAnnouncement" ).html("");
	$( "#enemyArea" ).html("");
	$( "#enemyAnnouncement" ).html("");
	$( ".character" ).removeClass("hidden");
	$( ".character" ).removeClass("selectedHero");
	$( ".character" ).removeClass("selectedEnemy");
	$( "#fightLog" ).html("");
	$( "#instructions" ).html("");
	$( "#statsArea" ).html("Choose your hero");

	playableCharacters = {
		britney: {
			name: "Britney",
			hp: 210,
			attack: 4,
			counterAtk: 14,
			musicValue: 0,
			pictureName: "britney.jpg"
		},
		christina: {
			name: "Christina",
			hp: 200,
			attack: 8,
			counterAtk: 14,
			musicValue: 2,
			pictureName: "christina.jpg"
		},
		nick: {
			name: "Nick",
			hp: 240,
			attack: 3,
			counterAtk: 14,
			musicValue: 3,
			pictureName: "nick.jpg"
		},
		justin: {
			name: "T-Lake",
			hp: 180,
			attack: 6,
			counterAtk: 16,
			musicValue: 1,
			pictureName: "justin.jpg"
		}
	};
};