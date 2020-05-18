declare interface Matrix {
    add(m:Matrix):Matrix;
    add(n:number):Matrix;
    sub(m:Matrix):Matrix;
    sub(n:number):Matrix;
}
class Matrix {
    data:Array<Array<number>>;
    rows:number;
    columns:number;
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
    add(n:Matrix|number) {
        if(n instanceof Matrix) {
            if(this.rows!==n.rows||this.columns!==n.columns)
                throw new Error("Can't perform add operation on matrices with diffiring dimensions");
            for(let i=0;i<this.rows;i++)
                for(let j=0;j<this.columns;j++)
                    this.data[i][j]+=n.data[i][j];
        } else if (typeof n==="number") {
            for(let i=0;i<this.rows;i++)
                for(let j=0;j<this.columns;j++)
                    this.data[i][j]+=n;
        }
        return this;
    }
    sub(n:Matrix|number) {
        if(n instanceof Matrix) {
            if(this.rows!==n.rows||this.columns!==n.columns)
                throw new Error("Can't perform sub operation on matrices with diffiring dimensions");
            for(let i=0;i<this.rows;i++)
                for(let j=0;j<this.columns;j++)
                    this.data[i][j]+=n.data[i][j];
        } else if (typeof n==="number") {
            for(let i=0;i<this.rows;i++)
                for(let j=0;j<this.columns;j++)
                    this.data[i][j]+=n;
        }
        return this;
    }
    dot(m:Matrix) {
        if (this.columns!==m.rows)
            throw new Error("Can't perform dot operation on matrices whose number of rows is not equivalent of the first matrix's number of columns")
    }
    scale(n:number) {
        for(let i=0;i<this.rows;i++)
            for(let j=0;j<this.columns;j++)
                this.data[i][j]*=n;
        return this;
    }
    transpose():Matrix {
        let result=new Matrix(this.columns,this.rows);
        for(let i=0;i<this.rows;i++)
            for(let j=0;j<this.columns;j++)
                result.data[j][i]=this.data[i][j];
        return result;
    }
    static random(rows:number,columns:number) {
        let result=new Matrix(rows,columns);
        for(let i=0;i<rows;i++)
            for(let j=0;j<columns;j++)
                result.data[i][j]=Math.random();
        return result
    }
}
export default Matrix