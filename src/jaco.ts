/// <reference path="DefinitelyTyped/node/node.d.ts" />

/**
 * Japanese String & Charactor Converter
 *
 * @module jaco
 */
module jaco {

	// [!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]
	export var SIGN_CHARS = '\\u0020-\\u002F\\u003A-\\u0041\\u005B-\\u0061\\u007B-\\u007E';
	// [0-9]
	export var DIGIT_CAHRS = '0-9';
	// [A-Za-z]
	export var ALPHA_CHARS = 'A-Za-z';
	// [!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~]
	export var ALPHANUMERIC_CHARS_WITH_SIGN = '\\u0020-\\u007E';
	// [！＂＃＄％＆＇（）＊＋，－．／：；＜＝＞？＠［＼］＾＿｀｛｜｝～]
	export var FULLWIDTH_SING_CHARS = '\\uFF01-\\uFF0F\\uFF1A-\\uFF20\\uFF3B-\\uFF40\\uFF5B-\\uFF5E';
	// [０１２３４５６７８９]
	export var FULLWIDTH_DIGIT_CHARS = '\\uFF10-\\uFF19';
	// [ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ]
	export var FULLWIDTH_ALPHA_CHARS = '\\uFF21-\\uFF3A\\uFF41-\\uFF5A';
	// [！＂＃＄％＆＇（）＊＋，－．／０１２３４５６７８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝～]
	export var FULLWIDTH_ALPHANUMERIC_CHARS_WITH_SIGN = '\\uFF01-\\uFF5F';
	// [ぁ-ゖゝ-ゟ]
	export var HIRAGANA_CHARS = '\\u3041-\\u3096\\u309D-\\u309F';
	// [ァ-ヺヽ-ヿ]
	export var KATAKANA_CHARS = '\\u30A1-\\u30FA\\u30FD\\u30FF';
	// [゛゜(結合文字含む)ー]
	export var KANA_COMMON_CAHRS = '\u3099-\u309C\u30FC';
	// [　、。〃〄々〆〇〈〉《》「」『』【】〒〓〔〕〖〗〘〙〚〛〜〝〞〟〠〡〢〣〤〥〦〧〨〩〪〭〮〯〫〬〰〱〲〳〴〵〶・～] ※ 波ダッシュ・全角チルダ問題があるため 全角チルダを含めることとする (http://ja.wikipedia.org/wiki/Unicode#.E6.B3.A2.E3.83.80.E3.83.83.E3.82.B7.E3.83.A5.E3.83.BB.E5.85.A8.E8.A7.92.E3.83.81.E3.83.AB.E3.83.80.E5.95.8F.E9.A1.8C)
	export var JAPANESE_SIGN_CHARS = '\u3000-\u3036\u30FB\\uFF5E';
	// [ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝﾞﾟ]
	export var NARROW_KATAKANA_CHARS = '\\uFF66-\\uFF9F';
	// [｡｢｣､･]
	export var NARROW_JAPANESE_SIGN_CHARS = '\\uFF61-\\uFF65';
	// [(スペース相等の文字)]
	export var SPACE_LIKE_CHARS = '\\s\\n\\t\\u0009\\u0020\\u00A0\\u2002-\\u200B\\u3000\\uFEFF';

	/**
	 * カタカナに変換する
	 *
	 * @method katakana
	 * @since 0.1.0
	 * @static
	 * @param {string} str 対象の文字列
	 * @return {string} 変換後の文字列
	 */
	export function katakana (str:string):string {
		return new Jaco(str).toKatakana().toString();
	}

	/**
	* ひらがなに変換する
	*
	* @method hiragana
	* @since 0.1.0
	* @static
	* @param {string} str 対象の文字列
	* @return {string} 変換後の文字列
	*/
	export function hiragana (str:string):string {
		return new Jaco(str).toHiragana().toString();
	}

	/**
	* カタカナに変換する
	*
	* @class Jaco
	* @since 0.1.0
	* @conctructor
	* @param {string} str 対象の文字列
	* @return {string} 変換後の文字列
	*/
	class Jaco {

		private _str:string;

		constructor (str:string = '') {
			this._str = str;
		}

		public toString ():string {
			return this._str;
		}

		public valueOf ():any {
			return this.toString();
		}

		public combinate () {
			// 濁点・半濁点を結合文字に変換
			return this._replaceMap({
				// 濁点
				'\u309B': '\u3099',
				// 半濁点
				'\u309C': '\u309A'
			});
		}

		// カタカナからひらがなへ
		public toHiragana (combinate:boolean = false) {
			// 半角カタカナを全角カタカナへ
			this.toWideKatakana();
			// ヷヸヹヺの変換
			this._replaceMap({
				'ヷ': 'わ゛',
				'ヸ': 'ゐ゛',
				'ヹ': 'ゑ゛',
				'ヺ': 'を゛'
			});
			// カタカナをひらがなへ(Unicodeの番号をずらす)
			this._shift(toPattern(KATAKANA_CHARS), -96);
			// 濁点・半濁点を結合文字に変換
			if (combinate) {
				this.combinate();
			}
			return this;
		}

		public toKatakana (toWide:boolean = true):Jaco {
			// 半角カタカナを全角カタカナへ
			if (toWide) {
				this.toWideKatakana();
			}
			// わ゛=> ヷ
			this._replace(/\u308F(?:\u309B|\u3099|\uFF9E)/g, '\u30F7');
			// ゐ゛=> ヸ
			this._replace(/\u3090(?:\u309B|\u3099|\uFF9E)/g, '\u30F8');
			// ゑ゛=> ヹ
			this._replace(/\u3091(?:\u309B|\u3099|\uFF9E)/g, '\u30F9');
			// を゛=> ヺ
			this._replace(/\u3092(?:\u309B|\u3099|\uFF9E)/g, '\u30FA');
			// ひらがなをカタカナへ(Unicodeの番号をずらす)
			this._shift(toPattern(HIRAGANA_CHARS), 96);
			return this;
		}

		public toNarrowKatakana ():Jaco {
			// 濁点の変換
			this._replace(/\u309B|\u3099/g, '\uFF9E');
			// 半濁点の変換
			this._replace(/\u309C|\u309A/g, '\uFF9F');
			// カタカナの変換
			this._replaceMap({
				'ァ': 'ｧ', 'ィ': 'ｨ', 'ゥ': 'ｩ', 'ェ': 'ｪ', 'ォ': 'ｫ', 'ャ': 'ｬ',
				'ュ': 'ｭ', 'ョ': 'ｮ', 'ッ': 'ｯ',
				'ー': 'ｰ',
				'ア': 'ｱ', 'イ': 'ｲ', 'ウ': 'ｳ', 'エ': 'ｴ', 'オ': 'ｵ',
				'カ': 'ｶ', 'キ': 'ｷ', 'ク': 'ｸ', 'ケ': 'ｹ', 'コ': 'ｺ',
				'サ': 'ｻ', 'シ': 'ｼ', 'ス': 'ｽ', 'セ': 'ｾ', 'ソ': 'ｿ',
				'タ': 'ﾀ', 'チ': 'ﾁ', 'ツ': 'ﾂ', 'テ': 'ﾃ', 'ト': 'ﾄ',
				'ナ': 'ﾅ', 'ニ': 'ﾆ', 'ヌ': 'ﾇ', 'ネ': 'ﾈ', 'ノ': 'ﾉ',
				'ハ': 'ﾊ', 'ヒ': 'ﾋ', 'フ': 'ﾌ', 'ヘ': 'ﾍ', 'ホ': 'ﾎ',
				'マ': 'ﾏ', 'ミ': 'ﾐ', 'ム': 'ﾑ', 'メ': 'ﾒ', 'モ': 'ﾓ',
				'ヤ': 'ﾔ', 'ユ': 'ﾕ', 'ヨ': 'ﾖ',
				'ラ': 'ﾗ', 'リ': 'ﾘ', 'ル': 'ﾙ', 'レ': 'ﾚ', 'ロ': 'ﾛ',
				'ワ': 'ﾜ', 'ン': 'ﾝ', 'ヰ': 'ｲ', 'ヱ': 'ｴ', 'ヲ': 'ｦ',
				'ガ': 'ｶﾞ', 'ギ': 'ｷﾞ', 'グ': 'ｸﾞ', 'ゲ': 'ｹﾞ', 'ゴ': 'ｺﾞ',
				'ザ': 'ｻﾞ', 'ジ': 'ｼﾞ', 'ズ': 'ｽﾞ', 'ゼ': 'ｾﾞ', 'ゾ': 'ｿﾞ',
				'ダ': 'ﾀﾞ', 'ヂ': 'ﾁﾞ', 'ヅ': 'ﾂﾞ', 'デ': 'ﾃﾞ', 'ド': 'ﾄﾞ',
				'バ': 'ﾊﾞ', 'ビ': 'ﾋﾞ', 'ブ': 'ﾌﾞ', 'ベ': 'ﾍﾞ', 'ボ': 'ﾎﾞ',
				'パ': 'ﾊﾟ', 'ピ': 'ﾋﾟ', 'プ': 'ﾌﾟ', 'ペ': 'ﾍﾟ', 'ポ': 'ﾎﾟ',
				'ヷ': 'ﾜﾞ', 'ヸ': 'ｲﾞ', 'ヹ': 'ｴﾞ', 'ヺ': 'ｦﾞ'
			});
			return this;
		}

		public toWideKatakana ():Jaco {
			// カタカナ・濁点・半濁点の変換
			this._replaceMap({
				'ｶﾞ': 'ガ', 'ｷﾞ': 'ギ', 'ｸﾞ': 'グ', 'ｹﾞ': 'ゲ', 'ｺﾞ': 'ゴ',
				'ｻﾞ': 'ザ', 'ｼﾞ': 'ジ', 'ｽﾞ': 'ズ', 'ｾﾞ': 'ゼ', 'ｿﾞ': 'ゾ',
				'ﾀﾞ': 'ダ', 'ﾁﾞ': 'ヂ', 'ﾂﾞ': 'ヅ', 'ﾃﾞ': 'デ', 'ﾄﾞ': 'ド',
				'ﾊﾞ': 'バ', 'ﾋﾞ': 'ビ', 'ﾌﾞ': 'ブ', 'ﾍﾞ': 'ベ', 'ﾎﾞ': 'ボ',
				'ﾊﾟ': 'パ', 'ﾋﾟ': 'ピ', 'ﾌﾟ': 'プ', 'ﾍﾟ': 'ペ', 'ﾎﾟ': 'ポ',
				'ﾜﾞ': 'ヷ', 'ｲﾞ': 'ヸ', 'ｳﾞ': 'ヴ', 'ｴﾞ': 'ヹ', 'ｦﾞ': 'ヺ',
				'ﾞ': '゛', 'ﾟ': '゜',
				'ｧ': 'ァ', 'ｨ': 'ィ','ｩ': 'ゥ', 'ｪ': 'ェ', 'ｫ': 'ォ',
				'ｬ': 'ャ', 'ｭ': 'ュ', 'ｮ': 'ョ',
				'ｯ': 'ッ', 'ｰ': 'ー',
				'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ',
				'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ',
				'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ',
				'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト',
				'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ',
				'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ',
				'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ',
				'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ',
				'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ',
				'ﾜ': 'ワ', 'ｦ': 'ヲ', 'ﾝ': 'ン'
			});
			return this;
		}

		private _shift (needle:RegExp, shiftNum:number):Jaco {
			this._str = this._str.replace(needle, (char) => {
				return String.fromCharCode(char.charCodeAt(0) + shiftNum);
			});
			return this;
		}

		private _replace (needle:RegExp, replace:string):Jaco {
			this._str = this._str.replace(needle, replace);
			return this;
		}

		private _replaceMap (convMap:any):Jaco {
			var needle:string;
			var replace:string;
			for (needle in convMap) {
				replace = convMap[needle];
				this._str = this._str.replace(toRegExp(needle), replace);
			}
			return this;
		}

	}

	function toPattern (chars:string):RegExp {
		return new RegExp('[' + chars + ']', 'g');
	}

	function toRegExp (str:string, option:string = 'igm'):RegExp {
		return new RegExp(str, option);
	}

}

(module).exports = jaco;