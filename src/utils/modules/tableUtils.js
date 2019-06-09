import Element from 'element-ui'
const {Tooltip} = Element
export default  {
    overflowTip : (h,text)=>{
        const tipSty = {
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        }
        return (
            <Tooltip content = {text} placement = "bottom-start">
                <span style = {tipSty}>{text}</span>
            </Tooltip>
        )

    }
}
