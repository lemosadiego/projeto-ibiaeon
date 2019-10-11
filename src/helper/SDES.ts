
export class SDES {

    public mensagem = "";
    private k1 = "";
    private k2 = "";

    constructor() {}

    public XOR(EP, k1) {
        var xor = "";
         for (var i = 0; i < EP.length; i++) {
             if (EP[i] == k1[i])
                 xor += "0";
             else
                 xor += "1";
         }
         return xor;
     }

    private pad (entrada,size) {
        var s = entrada;
        while (s.length < (size || 2)) { s = "0" + s; }
        return s;
    }

    private converteParaBinario(entrada) {
        var saida = this.pad((entrada.charCodeAt(0)).toString(2),8);
        return saida;
    }
    
    private converteParaLetra(binarioStr) {
        var charcode = String.fromCharCode((parseInt(binarioStr, 2)))
        return charcode;
    }
     
    private format(texto: string, argument: any[]) {
        var formatted = texto;
        for (var i = 0; i < argument.length; i++) {
            var regexp = new RegExp('\\{' + i + '\\}', 'gi');
            formatted = formatted.replace(regexp, argument[i]);
        }
        return formatted;
    };

    private P10(text) {
        return this.format("{2}{4}{1}{6}{3}{9}{0}{8}{7}{5}",[text[0], text[1], text[2], text[3], text[4],
                                                       text[5], text[6], text[7], text[8], text[9]]);
    }
    
    private P8(text) {
        return this.format("{3}{0}{4}{1}{5}{2}{7}{6}",[text[2], text[3], text[4], text[5],
                                                 text[6], text[7], text[8], text[9]]);
    }
    
    private P4(text) {
        return this.format("{1}{3}{2}{0}",[text[0], text[1], text[2], text[3]]);
    }
    
    private PI(text) {
        return this.format("{1}{5}{2}{0}{3}{7}{4}{6}",[text[0], text[1], text[2], text[3],
                                                 text[4], text[5], text[6], text[7]]);
    }
    
    private PInverso(text) {
        return this.format("{3}{0}{2}{4}{6}{1}{7}{5}",[text[0], text[1], text[2], text[3],
                                                 text[4], text[5], text[6], text[7]]);
    }
    
    private EP(text) {
        return this.format("{3}{0}{1}{2}{1}{2}{3}{0}",[text[0], text[1], text[2], text[3]]);
    }

    private ShiftLeft(text) {
        return text.substring(1, text.length) + text[0];
    }

    public GeradorChaves(chave) {
        var p10 = this.P10(chave);
    
        // divide P10 em duas Metades LS1 de tamanho 5
        var LS1Esquerdo = p10.substring(0, p10.length / 2);
        var LS1Direito = p10.substring(5);
    
        //da um Shift para a esquerda nas duas metades
        LS1Esquerdo = this.ShiftLeft(LS1Esquerdo);
        LS1Direito = this.ShiftLeft(LS1Direito);
    
        // concatena as duas metades
        var LS1 = LS1Esquerdo + LS1Direito;
    
        // obtem k1 após aplicar a regra de Permutação P8
        var k1 = this.P8(LS1);
    
        //da dois Shifts para a esquerda nas duas metades
        LS1Esquerdo = this.ShiftLeft(LS1Esquerdo);
        LS1Esquerdo = this.ShiftLeft(LS1Esquerdo);
        LS1Direito = this.ShiftLeft(LS1Direito);
        LS1Direito = this.ShiftLeft(LS1Direito);
    
        // concatena as duas metades
        var LS2 = LS1Esquerdo + LS1Direito;
    
        // obtem k2 após aplicar a regra de Permutação P8
        var k2 = this.P8(LS2);
    
        this.k1 = k1;
        this.k2 = k2;
    }

    public SDESRound(PI, k1) {

        var S0 = [["01", "00", "11", "10"],
        ["11", "10", "01", "00"],
        ["00", "10", "01", "11"],
        ["11", "01", "11", "10"]];
    
        var S1 = [["00", "01", "10", "11"],
        ["10", "00", "01", "11"],
        ["11", "00", "01", "00"],
        ["10", "01", "00", "11"]];
        //IP - Permutação Inicial
                // entrada: 1 2 3 4 5 6 7 8
                // saida:   2 6 3 1 4 8 5 7
    
                //EP - Expande e Permuta
                // entrada: 1 2 3 4
                // saida:   4 1 2 3 2 3 4 1
    
                // P4 - Permutação
                // entrada: 1 2 3 4
                // saida:   2 4 3 1
    
                //PI-1 - Permutação Inversa
                // entrada: 2 6 3 1 4 8 5 7
                // saida:   4 1 3 5 7 2 8 6
                // Console.WriteLine("------------INICIO DO ROUND USANDO O PI: " + PI+ " E A CHAVE: " + k1 );
    
    
                // divide PI em duas Metades de tamanho 4
        var esquerdaPI = PI.substring(0, (PI.length) / 2);
        var direitaPI = PI.substring(4);
        // calcula EP baseado na metade da direita de PI
        var ep = this.EP(direitaPI);
        var xor = this.XOR(ep, k1);
    
        var xor00 = new Number(xor[0])
        var xor01 = new Number(xor[1])
        var xor02 = new Number(xor[2])
        var xor03 = new Number(xor[3])
        var xor04 = new Number(xor[4])
        var xor05 = new Number(xor[5])
        var xor06 = new Number(xor[6])
        var xor07 = new Number(xor[7])
        var linha1 = Number(xor00.toString(2)) * 2 + parseInt(xor03.toString(2));
        var coluna1 = Number(xor01.toString(2)) * 2 + parseInt(xor02.toString(2));
        var linha2 = Number(xor04.toString(2)) * 2 + parseInt(xor07.toString(2));
        var coluna2 = Number(xor05.toString(2)) * 2 + parseInt(xor06.toString(2));
    
        // concatena os valores obtidos de S0 e S1
        var p4aux = S0[linha1][coluna1].toString() + S1[linha2][coluna2].toString();
        var p4 = this.P4(p4aux);
    
        var xor2 = this.XOR(p4, esquerdaPI);
        var resultado = xor2 + direitaPI;
        return resultado;
    
    }

    private SDESAux(mensagem, k1, k2) {
        var pi = this.PI(mensagem);
        var resultado = this.SDESRound(pi, k1);
        var sw = resultado.substring(4, resultado.length) + resultado.substring(0, 4);
        var resultado2 = this.SDESRound(sw, k2);
        var piInverso = this.PInverso(resultado2);
        return piInverso;
    }

    public Encrypt () {
        this.GeradorChaves("1001001001");
        var msgCifrada = "";
        for (var c = 0; c < this.mensagem.length; c++) {
            var ret = this.converteParaBinario(this.mensagem[c]);
            var msgSDES = this.SDESAux(ret, this.k1, this.k2);
            msgCifrada += this.converteParaLetra(msgSDES);
        }
        this.mensagem = msgCifrada;
    }
    
    public Decrypt () {
        this.GeradorChaves("1001001001");
        var msgDecifrada = "";
        for (var c = 0; c < this.mensagem.length; c++) {
            var ret = this.converteParaBinario(this.mensagem[c]);
            var msgSDES = this.SDESAux(ret, this.k2, this.k1);
            msgDecifrada += this.converteParaLetra(msgSDES);
        }
        this.mensagem = msgDecifrada;
    }
    
}