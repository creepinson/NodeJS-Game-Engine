class Matrix {
    data:number[][];
    rows:number;
    columns:number;
    /**
     * Create a new matrix filled with 0
     * @param {number} rows number of rows to have
     * @param {number} columns number of columns to have
     */
    constructor(rows:number,columns:number) {
        this.rows=rows;
        this.columns=columns;
        this.data=[];
        for(let i=0;i<rows;i++){
            this.data[i]=[];
            for(let j=0;j<columns;j++)
                this.data[i][j]=0;
        }
    }
    /**
     * Adds every matrix in an array to this matrix element wise
     * @param {Matrix[]} m the matrices to add
     */
    add(m:Matrix[]):Matrix;
    /**
     * Adds another matrix to this matrix element wise
     * @param {Matrix} m the matrix to add
     */
    add(m:Matrix):Matrix;
    /**
     * Add a number to each element of the matrix
     * @param {number} n the number to add
     */
    add(n:number):Matrix;
    /**
     * Matrix addition operation
     * @param {Matrix[]|Matrix|numbe} n what to add to the matrix
     * @returns {Matrix} this
     */
    add(n:Matrix[]|Matrix|number):Matrix {
        if(n instanceof Array) {
            this.element((n:number[]):number=>{
                let sum=0;
                for(let number of n)
                    sum+=number;
                return sum;
            },n);
        } else if(n instanceof Matrix) {
            if(this.rows!==n.rows||this.columns!==n.columns)
                throw new Error("Can't perform add operation on matrices with diffiring dimensions");
            for(let i=0;i<this.rows;i++)
                for(let j=0;j<this.columns;j++)
                    this.data[i][j]+=n.data[i][j];
        } else {
            for(let i=0;i<this.rows;i++)
                for(let j=0;j<this.columns;j++)
                    this.data[i][j]+=n;
        }
        return this;
    }
    /**
     * Subtract every matrix in an array from this matrix element wise
     * @param m 
     */
    sub(m:Matrix[]):Matrix;
    /**
     * Subtract a matrix from this matrix element wise
     * @param m
     */
    sub(m:Matrix):Matrix
    /**
     * Subtract a number from each element of the matrix
     * @param {number} n the number to add
     */
    sub(n:number):Matrix;
    /**
     * Matrix subtraction operation
     * @param {Matrix[]|Matrix|number} n what to subtract
     * @returns {Matrix} this
     */
    sub(n:Matrix[]|Matrix|number):Matrix {
        if(n instanceof Array) {
            this.element((n:number[]):number=>{
                let diffrence=n[0];
                for(let i=1;i<n.length;i++)
                    diffrence-=n[i];
                return diffrence;
            },n);
        } else if(n instanceof Matrix) {
            if(this.rows!==n.rows||this.columns!==n.columns)
                throw new Error("Can't perform sub operation on matrices with diffiring dimensions");
            for(let i=0;i<this.rows;i++)
                for(let j=0;j<this.columns;j++)
                    this.data[i][j]-=n.data[i][j];
        } else {
            for(let i=0;i<this.rows;i++)
                for(let j=0;j<this.columns;j++)
                    this.data[i][j]-=n;
        }
        return this;
    }
    /**
     * Matrix dot product operation
     * @param {Matrix} m the matrix to perform multplication with
     */
    dot(m:Matrix):Matrix {
        if(this.columns!=m.rows)
            throw new Error("Can't perform dot product on a second matrix who's number of rows doesn't equal the first matrix's number of columns");
        let result=new Matrix(this.rows,m.columns);
        for(let i=0;i<this.rows;i++)
            for(let j=0;j<m.columns;j++) {
                let sum=0;
                for(let k=0;k<this.columns;k++)
                    sum+=this.data[i][k]*m.data[k][j];
                result.data[i][j]=sum;
            }
        return result;
    }
    element(f:((n:number[])=>number)|((n:number,n2:number)=>number),m:Matrix[]|Matrix,m2?:Matrix):Matrix {
        if(m instanceof Array)
            this.data=Matrix.element(<(n:number[])=>number>f,[this,...m]).data;
        else {
            if(m2===undefined)throw new Error("");
            this.data=Matrix.element(<(n:number,n2:number)=>number>f,m,m2).data;
        }
        return this;
    }
    /**
     * Matrix scale operation
     * @param n the number to scale by
     */
    scale(n:number) {
        for(let i=0;i<this.rows;i++)
            for(let j=0;j<this.columns;j++)
                this.data[i][j]*=n;
        return this;
    }
    /**
     * Matrix transposition operation
     */
    transpose():Matrix {
        let result=new Matrix(this.columns,this.rows);
        for(let i=0;i<this.rows;i++)
            for(let j=0;j<this.columns;j++)
                result.data[j][i]=this.data[i][j];
        return result;
    }
    map(f:(n:number,i:number,j:number)=>number):Matrix {
        for(let i=0;i<this.rows;i++)
            for(let j=0;j<this.columns;j++)
                this.data[i][j]=f(this.data[i][j],i,j);
        return this;
    }
    toString():string { return this.data.map(a=>a.join(", ")).join("\n"); }
    print() { console.log(this.toString()); }
    static random(rows:number,columns:number) {
        let result=new Matrix(rows,columns);
        for(let i=0;i<rows;i++)
            for(let j=0;j<columns;j++)
                result.data[i][j]=Math.random();
        return result
    }
    static fromArray(a:number[]|number[][]) {
        let result=new Matrix((<any>a[0]).length??1,a.length);
        if(a[0] instanceof Array) {
            let l=a[0].length
            for(let nested of a)
                if((<number[]>nested).length!=l)
                    throw new Error("All of the nested arrays must have the same length");
            result.data=(<number[][]>a);
        } else result.data=[<number[]>a];
        return result;
    }
    /**
     * 
     * @param f 
     * @param m 
     * @param m2 
     */
    static element(f:(n:number,n2:number)=>number,m:Matrix,m2:Matrix):Matrix
    /**
     * 
     * @param f 
     * @param m 
     */
    static element(f:(n:number[])=>number,m:Matrix[]):Matrix;
    /**
     * Matrix element wise operation 
     */
    static element(f:(((n:number[])=>number)|((n:number,n2:number)=>number)),m:Matrix[]|Matrix,m2?:Matrix):Matrix {
        if(m instanceof Array) {
            let rows=m[0].rows;
            let columns=m[0].columns;
            for(let matrix of m)
                if(matrix.rows!=rows||matrix.columns!=columns)
                    throw new Error("Can't perform element wise operations on matrices of differing dimensions");
            let result=new Matrix(rows,columns);
            for(let i=0;i<rows;i++)
                for(let j=0;j<columns;j++)
                    result.data[i][j]=(<(n:number[])=>number>f)(m.map(matrix=>matrix.data[i][j]));
            return result;
        } else {
            if(m2===undefined)
                throw new Error("Can't perform element wise operation with only one matrix");
            if(m.rows!=m2.rows||m.columns!=m2.columns)
                throw new Error("Can't perform element wise operations on matrices of differing dimensions");
            let result=new Matrix(m.rows,m.columns);
            for(let i=0;i<m.rows;i++)
                for(let j=0;j<m.columns;j++)
                    result.data[i][j]=(<(n:number,n1:number)=>number>f)(m.data[i][j],m2.data[i][j]);
            return result
        }
    }
}
export default Matrix