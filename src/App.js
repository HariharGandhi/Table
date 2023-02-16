import "./App.css";
import { useEffect, useState} from "react";
import axios from "axios";
export default function App() {
  const [data, setData] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isreply, setIsReply] = useState(false);
  const [isDated, setIsDated] = useState(false);
  const [page, setPage] = useState(1);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("https://dev.ylytic.com/ylytic/test");
        setData(data.comments);
        console.log(data);
      } catch (error) {
        console.log("Error");
      }
    })();
  }, []);
  const sortLikes = (data, setData) => {
    setIsLiked((prev) => !prev);
    if (!isLiked) {
      setData([...data].sort((a, b) => Number(a.like) - Number(b.like)));
    } else {
      setData([...data].sort((a, b) => Number(b.like) - Number(a.like)));
    }
  };
  const sortDate = (data, setData) => {
setIsDated((prev) => !prev);
if (!isDated) {
  setData([...data].sort((a, b) => new Date((a.at.slice(0,-4))).getTime() - new Date(b.at.slice(0,-4)).getTime()));
} else {
  setData([...data].sort((a, b) => new Date(b.at.slice(0,-4)).getTime() - new Date(a.at.slice(0,-4)).getTime()));
}
  };
  const sortReply = (data, setData) => {
    setIsReply((prev) => !prev);
    if (!isreply) {
      setData([...data].sort((a, b) => Number(a.reply) - Number(b.reply)));
    } else {
      setData([...data].sort((a, b) => Number(b.reply) - Number(a.reply)));
    }
  };
  const sortAuthor = (data, setData) => {
    setData([...data].sort((a, b) => a.author.localeCompare(b.author)));
  };
  const sortText = (data, setData) => {
    setData([...data].sort((a, b) => a.text.localeCompare(b.text)));
  };
  const selectPageHandler = (selectedPage) => {
    if(selectedPage >=1 && selectedPage <= data.length/10 && selectedPage !== page) 
    setPage(selectedPage)
  }
  const [search, setSearch] = useState('')
  return (
    <div className="App" >
      <div style={{justifyContent: 'center'}}><h1>Table of Contents</h1></div>
        <form style={{display : 'flex', justifyContent: 'right', marginRight : '80px', marginBottom:'10px'}}>
          <input type="text" placeholder="Search" 
                  onChange={(e)=> setSearch(e.target.value)} 
          />
        </form>
          <div style={{display: 'flex',justifyContent : 'center'}}>
            <table id="sortable" border={5}>
              <thead>
                <tr>
                  <th style={{ cursor: "pointer"}}
                  onClick={() => sortDate(data, setData)}
                  >At</th>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => sortAuthor(data, setData)}
                  >
                    Author
                  </th>
                  <th
                    style={{  cursor: "pointer" }}
                    onClick={() => sortLikes(data, setData)}
                  >
                    likes
                  </th>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => sortReply(data, setData)}
                  >
                    reply
                  </th>
                  <th
                    style={{ padding: "4px", cursor: "pointer" }}
                    onClick={() => sortText(data, setData)}
                  >
                    text
                  </th>
                </tr>
              </thead>
              <tbody>
              { 
                data.slice(page*10-10,page*10).filter((item) => {
                  return search.toLowerCase() === '' ? item : (item.author.toLowerCase().includes(search) || item.text.toLowerCase().includes(search))
                }).map((ele) => {
                  return (
                    <tr>
                      <td style={{ width: "200px", padding: "8px" }}>
                        {ele.at}
                      </td>
                      <td style={{ width: "150px", padding: "8px" }}>
                        {ele.author}
                      </td>
                      <td style={{ width: "100px", padding: "8px" }}>
                        {ele.like}
                      </td>
                      <td style={{ width: "100px", padding: "8px" }}>
                        {ele.reply}
                      </td>
                      <td style={{ width: "700px", padding: "8px" }}>
                        {ele.text}
                      </td>
                    </tr>
                  );
                })}
                
              </tbody>
              
            </table>
            
          </div>
          {
                  data.length > 0 && <div className="pagination">
                    <span className={page > 1 ? "" : "pagination__disable"}
                          onClick = {() => selectPageHandler(page-1)} >◀️</span>
                    {
                      [...Array(data.length/10)].map((_,i)=>{
                        return <span className={page === i + 1 ? "pagination__selected" : ""}
                                    onClick = {() => selectPageHandler(i+1)} key={i}> {i + 1} </span>;
                      })
                    }
                    
                    <span className={page < data.length / 10 ? "" : "pagination__disable"}
                    onClick = {() => selectPageHandler(page+1)} >▶️</span>
                  </div>
                }

          </div>
  );
}
