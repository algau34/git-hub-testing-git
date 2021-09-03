/**
 * Created by jetbrains web development IDE ( Web/PhpStorm ).
 * Project: define-newElementHTML - spineNav
 * User: Pascal Gaudin
 * Mail: pascal.gaudin@zimmerbiomet.com
 * Date: 16/08/2021
 * Time: 12:05
 */
// ______________________________________________________________________


Object.prototype.implement = function () {
	console.log(Object.getOwnPropertyNames(this.prototype), this.toLocaleString().split(/\n/).filter(f => f != "" && ["{", "}"].indexOf(f) == -1));
	Object.getOwnPropertyNames(this.prototype).forEach((v) => {
		console.log(v.arguments)
	})
}
var interface = function (oInterface) { }


// Déclarations
class Interface_IVehicule { // interface
	getNom() {}// String
	getMarque() {} //String
	getPrix() {} //int
	getPoids() {} //int
}

/**
 * abstact
 */
class Voiture extends Interface_Vehicule {
	_aNom=null;
	_aMarque=null;


	constructor() {
		super();
		if (this.constructor == Voiture) {
			throw new Error("This class cannot be instantiated !");
		}
	}

	setNom(pNom) {	//protected
		this.aNom = pNom;
	}

	getNom() {
		return this.aNom;
	}

	setMarque(pMarque) {//protected
		this.aMarque = pMarque;
	}

	getMarque() {
		return this.aMarque;
	}
}

/**
 *
 */
class DS extends Voiture {

	constructor() {
		super();
		this.setNom("DS");
		this.setMarque("Citroën");
	}

	getPrix() {
		return 30000;
	}

	getPoids() {
		return 1500;
	}
}

// ______________________________________________________________________
// Décorateurs
public
abstract

class VoitureAvecOption extends Voiture {
	private IVehicule
	aVehicule;

	protected
	void

	setVehicule(IVehicule

	pVehicule
) {
	this
.
	aVehicule = pVehicule;
}

getVehicule()
{
	return this.aVehicule;
}
}

class VoitureAvecToitOuvrant extends VoitureAvecOption {
	getPrix() {
		return this.getVehicule().getPrix() + 10000;
	}

	getPoids() {
		return this.getVehicule().getPoids() + 15;
	}
}

//On garde le nom du pattern Decorator pour savoir qu'on wrap un objet
DSAvecToitOuvrantDecorator
extends
VoitureAvecToitOuvrant
{
	public
	DSAvecToitOuvrantDecorator(DS
	pDS
)
	{
		this.setVehicule(pDS);
	}
}

class Main {
	// ______________________________________________________________________
	// Implémentation
	static void

	main(String

	[]
	args
) {
	DS
	vDS = new DS();
	IVehicule
	vDSOption = new DSAvecToitOuvrantDecorator(vDS);
	System
.
	out
.

	println(vDSOption

.

	getPoids()

+
	" - "
+
	vDSOption
.

	getPrix()

)
	;
}
}
