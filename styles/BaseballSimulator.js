
			import * as THREE from 'https://threejs.org/build/three.js';
			var scene = new THREE.Scene();
			var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

			var renderer = new THREE.WebGLRenderer();
			renderer.setSize( window.innerWidth, window.innerHeight );
			document.body.appendChild( renderer.domElement );

			//create baseball
			var geometry = new THREE.SphereGeometry();
			var material = new THREE.MeshBasicMaterial( { color: 0xf54fff } );
			var rock = new THREE.Mesh( geometry, material );
			
			scene.add( rock );

			camera.position.z = 5;

	

			var animate = function () {
				requestAnimationFrame( animate );

				rock.rotation.x += 0.00;
				rock.rotation.y += 0.02;

				renderer.render( scene, camera );
			};

			animate(); 

			window.addEventListener( 'resize', onWindowResize, false );

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.outputEncoding = THREE.sRGBEncoding;

				render();

            }