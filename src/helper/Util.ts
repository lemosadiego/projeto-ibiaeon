
export class Util {
    constructor() {}

    public static aplicaMascara(mascara: string, s: string) : string {
        var retorno: string = '';
        if(s.length < mascara.length) {
            retorno = this.padLeft(s, mascara.length, '0');
        } else {
            var result = '';
            s = s.substring((s.length - mascara.length), mascara.length);
            for(var i = 0; i < mascara.length; i++) {
                if(!isNaN(+mascara[i])) {
                    if(!isNaN(+s[i])) {
                        result += s[i];
                    }
                }
            }
            retorno = result;
        }
        return retorno;
    }

    public static formataCodigo(mascara: string, s: string) : string {
        var retorno: string = '';
        if(s.length < mascara.length) {
            retorno = this.padLeft(s, mascara.length, '0');
        } else {
            var result = '';
            if(s.charAt(mascara.length) == 'F')
                s = s.substring(0, mascara.length);
            else
                s = s.substring((s.length - mascara.length), s.length);
            for(var i = 0; i < mascara.length; i++) {
                if(!isNaN(+mascara[i])) {
                    if(!isNaN(+s[i])) {
                        result += s[i];
                    }
                }
            }
            retorno = result;
        }
        return retorno;
    }

    private static padLeft(data, size, paddingChar) {
        return (new Array(size + 1).join(paddingChar || '0') + String(data)).slice(-size);
    }

    public static modifyDate(dt: any): string {
        var date = null;
        if (dt === undefined) {
            return '\'\'';
        }
        if(dt instanceof Date) {
            date = dt
        } else {
         date = new Date(dt);
        }
        var d = date.getDate();
        var m = date.getMonth() + 1;
        var y = date.getFullYear();
        var hh = date.getHours();
        var mm = date.getMinutes();
        var ss = date.getSeconds();
        return '\''+y+'-'+(m <= 9 ? '0' + m : m)+'-'+(d <= 9 ? '0' + d : d)
        +' '+ (hh <= 9 ? '0' + hh : hh)+':'+(mm <= 9 ? '0' + mm : mm)+':'+(ss <= 9 ? '0' + ss : ss)+'\'';
    }

    public static gerarData(dt: Date): string {
        return this.modifyDate(dt).replace(/'/g,'');
    }
    public static modifyDateddmmyy(dt: any): string {
        var date = null;
        if (dt === undefined) {
            return '\'\'';
        }
        if(dt instanceof Date) {
            date = dt
        } else {
         date = new Date(dt);
        }
        var d = date.getDate();
        var m = date.getMonth() + 1;
        var y = date.getFullYear();
        return '\''+(d <= 9 ? '0' + d : d)+'-'+(m <= 9 ? '0' + m : m)+'-'+y+'\'';
    }
}