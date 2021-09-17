/**
 * Created by jetbrains web development IDE ( Web/PhpStorm ).
 * Project: define-newElementHTML - myProject
 * User: algau34
 * Mail: al.gau@free.fr
 * Date: 09/07/2021
 * Time: 14:59
 */

/**
 * class PubSub
 * @classdesc publish subscribe
 */
class PubSub {

	/**
	 * @memberOf PubSub
	 * @type {{}}
	 */
	static messages = {};

	/**
	 * @memberOf PubSub
	 * @type {number}
	 */
	static lastUid = -1;

	/**
	 * @memberOf PubSub
	 * @type {string}
	 */
	static ALL_SUBSCRIBING_MSG = '*';

	/**
	 * @memberOf PubSub
	 * @type {boolean}
	 */
	static immediateExceptions = true;
	/**
	 * @memberOf PubSub
	 */
	static  instance;

	/**
	 *
	 * @param lastUid
	 * @param ALL_SUBSCRIBING_MSG
	 * @param immediateExceptions
	 */
	constructor(lastUid = -1, ALL_SUBSCRIBING_MSG = '*', immediateExceptions = true) {

		PubSub.ALL_SUBSCRIBING_MSG = ALL_SUBSCRIBING_MSG;
		PubSub.lastUid = lastUid;
		PubSub.immediateExceptions = immediateExceptions;
	}

	/**
	 * singleton
	 * @returns {*}
	 */
	static get getInstance() {
		if (PubSub.instance == null) {
			PubSub.instance = new PubSub();
			// Hide the constructor so the returned object can't be new'd...
			PubSub.instance.constructor = null;
		}
		return PubSub.instance;
	}

	/**
	 *  Publishes the message synchronously, passing the data to it's subscribers
	 * @param message
	 * @param data
	 * @returns {*|Boolean}
	 */
	static publishSync(message, data) {
		return PubSub.publish(message, data, true, PubSub.immediateExceptions);
	};

	/**
	 * Subscribes the passed function to the passed message. Every returned token is unique and should be stored if you need to unsubscribe
	 * @param message
	 * @param func
	 * @returns {string|boolean}
	 */
	static subscribe(message, func) {
		if (typeof func !== 'function') {
			return false;
		}

		message = (typeof message === 'symbol') ? message.toString() : message;

		// message is not registered yet
		if (!Object.prototype.hasOwnProperty.call(PubSub.messages, message)) {
			PubSub.messages[message] = {};
		}

		// forcing token as String, to allow for future expansions without breaking usage
		// and allow for easy use as key names for the 'messages' object
		var token = 'uid_' + String(++PubSub.lastUid);
		PubSub.messages[message][token] = func;

		// return token for unsubscribing
		return token;
	};

	/**
	 *
	 * @param func
	 * @returns {string|boolean}
	 */
	static subscribeAll(func) {
		return PubSub.subscribe(PubSub.ALL_SUBSCRIBING_MSG, func);
	};

	/**
	 *  Subscribes the passed function to the passed message once
	 * @param message
	 * @param func
	 * @returns {PubSub}
	 */
	static subscribeOnce(message, func) {
		var token = PubSub.subscribe(message, function () {
			// before func apply, unsubscribe message
			PubSub.unsubscribe(token);
			func.apply(this, arguments);
		});
		return PubSub;
	};

	/**
	 * Clears all subscriptions
	 */
	static clearAllSubscriptions() {
		PubSub.messages = {};
	};

	/**
	 *  Clear subscriptions by the topic
	 * @param topic
	 */
	static clearSubscriptions(topic) {
		var m;
		for (m in PubSub.messages) {
			if (Object.prototype.hasOwnProperty.call(PubSub.messages, m) && m.indexOf(topic) === 0) {
				delete PubSub.messages[m];
			}
		}
	};

	/**
	 * Count subscriptions by the topic
	 * @param topic
	 * @returns {number}
	 */
	static countSubscriptions(topic) {
		var m;
		// eslint-disable-next-line no-unused-vars
		var token;
		var count = 0;
		for (m in PubSub.messages) {
			if (Object.prototype.hasOwnProperty.call(PubSub.messages, m) && m.indexOf(topic) === 0) {
				for (token in PubSub.messages[m]) {
					count++;
				}
				break;
			}
		}
		return count;
	};


	/**
	 * Gets subscriptions by the topic
	 * @param topic
	 * @returns {string[]}
	 */
	static getSubscriptions(topic) {
		return Object.keys(PubSub.messages);
	};

	/**
	 * Removes subscriptions
	 *
	 * - When passed a token, removes a specific subscription.
	 *
	 * - When passed a function, removes all subscriptions for that function
	 *
	 * - When passed a topic, removes all subscriptions for that topic (hierarchy)
	 * @example // Unsubscribing with a token
	 * PubSub.unsubscribe(token);
	 * var token = PubSub.subscribe('mytopic', myFunc);
	 * @example // Unsubscribing with a function
	 * PubSub.unsubscribe(myFunc);
	 * @example // Unsubscribing from a topic
	 * PubSub.unsubscribe('mytopic');
	 *
	 * @param value
	 * @returns {boolean} A token, function or topic to unsubscribe from
	 */
	static unsubscribe(value) {
		var descendantTopicExists = (topic) => {
				var m;
				for (m in PubSub.messages) {
					if (Object.prototype.hasOwnProperty.call(PubSub.messages, m) && m.indexOf(topic) === 0) {
						// a descendant of the topic exists:
						return true;
					}
				}
				return false;
			},
			isTopic               = typeof value === 'string' && (Object.prototype.hasOwnProperty.call(PubSub.messages, value) ||
																  descendantTopicExists(value)),
			isToken               = !isTopic && typeof value === 'string',
			isFunction            = typeof value === 'function',
			result                = false,
			m, message, t;

		if (isTopic) {
			PubSub.clearSubscriptions(value);
			return;
		}

		for (m in PubSub.messages) {
			if (Object.prototype.hasOwnProperty.call(PubSub.messages, m)) {
				message = PubSub.messages[m];

				if (isToken && message[value]) {
					delete message[value];
					result = value;
					// tokens are unique, so we can just stop here
					break;
				}

				if (isFunction) {
					for (t in message) {
						if (Object.prototype.hasOwnProperty.call(message, t) && message[t] === value) {
							delete message[t];
							result = true;
						}
					}
				}
			}
		}

		return result;
	};

	/**
	 * test if pubSub has one key
	 * @param obj
	 * @returns {boolean}
	 * @private
	 */
	_hasKeys(obj) {
		var key;

		for (key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				return true;
			}
		}
		return false;
	}

	/**
	 *  Returns a _that throws the passed exception, for use as argument for setTimeout
	 * @param { Object } ex An Error object
	 * @private
	 */
	_throwException(ex) {
		throw ex.toString();
	}

	/**
	 *
	 * @param subscriber
	 * @param message
	 * @param data
	 * @private
	 */
	_callSubscriberWithDelayedExceptions(subscriber, message, data) {
		try {
			subscriber(message, data);
		} catch (ex) {
			setTimeout(this._throwException(ex), 0);
		}
	}

	/**
	 *
	 * @param subscriber
	 * @param message
	 * @param data
	 * @private
	 */
	_callSubscriberWithImmediateExceptions(subscriber, message, data) {
		subscriber(message, data);
	}

	/**
	 *
	 * @param originalMessage
	 * @param matchedMessage
	 * @param data
	 * @param immediateExceptions
	 * @private
	 */
	_deliverMessage(originalMessage, matchedMessage, data, immediateExceptions) {
		var subscribers    = PubSub.messages[matchedMessage],
			callSubscriber = immediateExceptions ? this._callSubscriberWithImmediateExceptions : this._callSubscriberWithDelayedExceptions,
			s;

		if (!Object.prototype.hasOwnProperty.call(PubSub.messages, matchedMessage)) {
			return;
		}

		for (s in subscribers) {
			if (Object.prototype.hasOwnProperty.call(subscribers, s)) {
				callSubscriber(subscribers[s], originalMessage, data);
			}
		}
	}

	/**
	 *
	 * @param message
	 * @param data
	 * @param immediateExceptions
	 * @returns {Function|null}
	 * @private
	 */
	_createDeliveryFunction(message, data, immediateExceptions) {
		return () => {
			var topic    = String(message),
				position = topic.lastIndexOf('.');

			// deliver the message as it is now
			this._deliverMessage(message, message, data, immediateExceptions);

			// trim the hierarchy and deliver message to each level
			while (position !== -1) {
				topic = topic.substr(0, position);
				position = topic.lastIndexOf('.');
				this._deliverMessage(message, topic, data, immediateExceptions);
			}

			this._deliverMessage(message, PubSub.ALL_SUBSCRIBING_MSG, data, immediateExceptions);
		};
	}

	/**
	 *
	 * @param message
	 * @returns {boolean}
	 * @private
	 */
	_hasDirectSubscribersFor(message) {
		var topic = String(message),
			found = Boolean(Object.prototype.hasOwnProperty.call(PubSub.messages, topic) && this._hasKeys(PubSub.messages[topic]));

		return found;
	}

	/**
	 *
	 * @param message
	 * @returns {boolean}
	 * @private
	 */
	_messageHasSubscribers(message) {
		var topic    = String(message),
			found    = this._hasDirectSubscribersFor(topic) || this._hasDirectSubscribersFor(PubSub.ALL_SUBSCRIBING_MSG),
			position = topic.lastIndexOf('.');

		while (!found && position !== -1) {
			topic = topic.substr(0, position);
			position = topic.lastIndexOf('.');
			found = this._hasDirectSubscribersFor(topic);
		}

		return found;
	}

	/**
	 *
	 * @param message
	 * @param data
	 * @param sync
	 * @param immediateExceptions
	 * @returns {boolean}
	 * @private
	 */
	_publish(message, data, sync, immediateExceptions) {
		message = (typeof message === 'symbol') ? message.toString() : message;

		var deliver        = this._createDeliveryFunction(message, data, immediateExceptions),
			hasSubscribers = this._messageHasSubscribers(message);

		if (!hasSubscribers) {
			return false;
		}

		if (sync === true) {
			deliver();
		} else {
			setTimeout(deliver, 0);
		}
		return true;
	}

	/**
	 * Publishes the message, passing the data to it's subscribers
	 * @param { String } message The message to publish
	 * @param {} data The data to pass to subscribers
	 * @return { Boolean }
	 */

	static publish(message, data) {
		return PubSub.getInstance._publish(message, data, false, PubSub.immediateExceptions);
	};

}


