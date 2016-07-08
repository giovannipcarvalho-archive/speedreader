/* global angular */
var app = angular.module('speedreader', ['ngMaterial']);

app.controller('MainController', ['$scope', '$interval', '$mdDialog',
function($scope, $interval, $mdDialog){
	var text = "Estabelecer e manter uma conversação é essencial para o bom andamento de negociações, para apresentar uma proposta, levantar informações e tantas outras necessidades do dia-a-dia profissional e pessoal. Para muitas pessoas trata-se de uma habilidade natural, um talento que facilita o desenvolvimento das competências relacionadas à comunicação. Para outras tantas, manter a conversa fluindo para estabelecer empatia até chegar ao ponto em que o interesse comum possa ser encontrado e adequadamente tratado (nas situações em que não se deseja ir diretamente a ele, claro) é um desafio constante, que requer atenção e técnicas especiais até que seja internalizado e vire algo natural, pronto para ser colocado em prática quando uma oportunidade de conversa importante surge inesperadamente. Não há regras definidas, mas o que “mantém a conversa andando” é similar tanto na conversa no corredor na firma, quanto na mesa de bar, quanto no começo de um almoço de negócios: ambas as partes precisam estar atentas, acrescentando elementos continuamente, seguindo em direção ao seu objetivo mas sem desconsiderar o que ouvem, nem colocar a outra pessoa em uma situação que a bloqueie de prosseguir em direção ao interesse comum. Conhecer técnicas que facilitem o processo é interessante e pode conduzir a melhoria nas comunicações, e assim separei as 3 dicas a seguir, nascidas de orientações dadas aos atores de teatro de improviso (aqueles que recebem uma situação absurda, como ‘um sapateiro e um dentista vendendo enciclopédias em uma aldeia esquimó’ e a desenvolvem ao vivo, sem combinação prévia), para manter o fluxo da conversação: 1. Diga sim. Mesmo que você considere que há erros no que foi afirmado, se o seu interesse for manter a conversação fluindo (para mais tarde poder voltar a este ponto numa abordagem mais positiva), rejeite a tentação de negar ou corrigir (que leva a outra pessoa a cruzar os braços, fechar a cara e começar a se defender, e não à continuidade do desenrolar), e procure encontrar algo de positivo para dizer a seguir, com foco nos pontos em comum e relacionado ao que foi dito – mas cuidado para não confirmar, sem querer, que concorda com o ponto que você rejeita. 2. Acrescente algo. Não pare no Sim, diga “Sim, e…”, e aí acrescente algum elemento novo à conversa. Um exemplo favorável, um caso que confirme o seu ponto de vista, uma exceção curiosa, uma hipótese, uma dúvida… não importa. Uma conversa que flui não é um protocolo rígido em que uma parte apresenta e a outra confirma ou nega, mas sim uma construção contínua em que ambas as partes acrescentam elementos, que individualmente não precisam ser relevantes (nem curiosos, engraçados, etc.), mas sim conduzir ao ponto que se busca discutir. 3. Pergunte menos, afirme mais. Uma conversação saudável não é um interrogatório, e enquanto você estiver criando as condições para chegar à parte objetiva da negociação, é positivo evitar fazer perguntas diretas que forcem a pessoa a expor algo específico ou literalmente fugir de uma questão que preferem não responder no momento. Para obter fatos, uma alternativa é começar contando algo sobre a sua própria situação, e depois acrescentar sua questão de forma ampla, tipo “e vocês lá, como lidam com isso?” Um complemento importante às 3 regras acima é essencial para quem se sente inseguro em conversações sem estrutura formal: assim nos palcos como nos diálogos, não existe uma forma certa unificada de prosseguir, e as pessoas que conversam de maneira natural tratam eventuais erros e dificuldades de comunicação como um assunto a mais, usando-os como oportunidade para enriquecer e tornar mais pessoal a conversa. Imite-os, e você acabará se tornando um deles! Eu conheci as 3 regras acima por meio do livro “Bossypants“, autobiografia da comediante (entre outras atividades) Tina Fey, cuja versão em audiobook (narrada pela própria autora) eu ouvi entre um engarrafamento e outro e recomendo!";

	$scope.text = text.split(" ");
	
	$scope.prevword = "";
	$scope.word = $scope.text[0];
	$scope.nextword = $scope.text[1];
	
	$scope.pos = 0;
	$scope.wpm = 200;
	$scope.progress = 0;

	var delay = 1000/($scope.wpm)*60;
	
	function updateWPM(){
		delay = 1000/($scope.wpm)*60;
		pause();
	}
	
	function updateWords(){
		if($scope.pos > 0){
			$scope.prevword = $scope.text[$scope.pos - 1];
		} else {
			$scope.prevword = "";
		}
		
		$scope.word = $scope.text[$scope.pos];
		
		if($scope.pos < $scope.text.length){
			$scope.nextword = $scope.text[$scope.pos + 1];
		} else {
			$scope.nextword = "";
		}
		
		$scope.progress = $scope.pos / $scope.text.length * 100;
	}

	var stop;
	function update(){
		if ($scope.pos >= $scope.text.length - 1){
			pause();
		} else {
			$scope.pos++;
			updateWords();
			console.log("Delay: " + delay + ". Pos: " + $scope.pos + ". Word: " + $scope.word);
		}
	}
	
	function play(){
		stop = $interval(update, delay);				
		document.getElementById('prevbox').style.visibility = 'hidden';
		document.getElementById('nextbox').style.visibility = 'hidden';
	}
	
	function pause(){
		$interval.cancel(stop);
		stop = undefined;
		document.getElementById('prevbox').style.visibility = 'visible';
		document.getElementById('nextbox').style.visibility = 'visible';
	}
	var colorScheme = 0;
	$scope.hotkey = function(event){
		console.log(event.keyCode);
		if(event.keyCode == 32){
			if(stop == undefined){
				//play
				play();
			} else {
				//pause
				pause();
			}
		} else if (event.keyCode == 106){
			$scope.next();
		} else if (event.keyCode == 107){
			$scope.prev();
		} else if (event.keyCode == 45 || event.keyCode == 95){
			$scope.wpm -= 10;
			updateWPM();
		} else if (event.keyCode == 43 || event.keyCode == 61){
			$scope.wpm += 10;
			updateWPM();
		} else if (event.keyCode == 114) {
			pause();
			$scope.pos = 0;
			updateWords();
		} else if (event.keyCode == 99) {
			// toggle color
			if (colorScheme == 0) {
				document.getElementsByTagName('body')[0].style.backgroundColor = '#313131';
				document.getElementsByTagName('body')[0].style.color = '#ccc';
				colorScheme++;
			} else if (colorScheme == 1){
				document.getElementsByTagName('body')[0].style.backgroundColor = 'white';
				document.getElementsByTagName('body')[0].style.color = 'black';
				colorScheme = 0;
			}
			
		} else if (event.keyCode == 116) {
			// set text dialog
		} else if (event.keyCode == 63) {
		    $mdDialog.show(
		      $mdDialog.alert()
		        .clickOutsideToClose(true)
		        .title('Help')
		        .textContent('Help menu')
		        .ariaLabel('Alert Dialog Demo')
		        .ok('Got it!')
		    );
		}
	}

	// var scrollCount = 0;
	// var scrollThreshold = 12;
	
	$scope.prev = function() {
		// scrollCount++;
		// if($scope.pos > 0 && scrollCount >= scrollThreshold){
		if($scope.pos > 0){
			//$scope.word = $scope.text[--$scope.pos];
			$scope.pos--;
			// scrollCount = 0;
		}
		updateWords();
	}

	$scope.next = function() {
		// scrollCount++;
		// if($scope.pos < $scope.text.length && scrollCount >= scrollThreshold){
		if($scope.pos < $scope.text.length - 1){
			//$scope.word = $scope.text[++$scope.pos];
			$scope.pos++;
			// scrollCount = 0;
		}
		updateWords();
	}
}]);

app.directive('ngMouseWheelUp', function() {
        return function(scope, element, attrs) {
            element.bind("DOMMouseScroll mousewheel onmousewheel", function(event) {
                   
                        // cross-browser wheel delta
                        var event = window.event || event; // old IE support
                        var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
                
                        if(delta > 0) {
                            scope.$apply(function(){
                                scope.$eval(attrs.ngMouseWheelUp);
                            });
                        
                            // for IE
                            event.returnValue = false;
                            // for Chrome and Firefox
                            if(event.preventDefault) {
                                event.preventDefault();                        
                            }

                        }
            });
        };
});

app.directive('ngMouseWheelDown', function() {
        return function(scope, element, attrs) {
            element.bind("DOMMouseScroll mousewheel onmousewheel", function(event) {
                   
                        // cross-browser wheel delta
                        var event = window.event || event; // old IE support
                        var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
                
                        if(delta < 0) {
                            scope.$apply(function(){
                                scope.$eval(attrs.ngMouseWheelDown);
                            });
                        
                            // for IE
                            event.returnValue = false;
                            // for Chrome and Firefox
                            if(event.preventDefault)  {
                                event.preventDefault();
                            }

                        }
            });
        };
});
