const header=document.getElementById('header'),menu=document.getElementById('menu'),btn=document.getElementById('menuBtn');
window.addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>8),{passive:true});
btn?.addEventListener('click',()=>menu.classList.toggle('open'));
menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(e=>io.observe(e));
