import { Component, OnInit , OnDestroy } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PostPostReq } from '../../model/Posts.post.req.js';
import { CommonModule } from '@angular/common';
import axios from 'axios';
import { conn } from "../../../api/dbconnect";
import { ActivatedRoute } from '@angular/router';
import {MatChipsModule} from '@angular/material/chips';
import Swal from 'sweetalert2'
import { Subscription, interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import cors from "cors";
@Component({
  selector: 'app-vote',
  standalone: true,
  imports: [MatToolbarModule,MatButtonModule,HttpClientModule,CommonModule],
  templateUrl: './vote.component.html',
  styleUrl: './vote.component.scss'
})
export class VoteComponent implements OnInit, OnDestroy {
  show: PostPostReq[] = [];
  K: number = 32;
  PictureID: number[] = [];
  currentDate: string = ''; // กำหนดค่าเริ่มต้นเป็น string
  userId: string = ''; // กำหนดค่าเริ่มต้นสำหรับ userId
  private destroy$: Subject<void> = new Subject(); // เพื่อยกเลิกการทำงานของ interval อย่างถูกต้อง

  constructor(private router: Router, private route: ActivatedRoute, private httpClient: HttpClient) {}
  //รับค่า userId จาก query parameters และแสดงผ่านทาง console.log()
  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.userId = params['user_id'];
      console.log('Received userId:', this.userId); // ใช้ console.log() เพื่อตรวจสอบค่า userId
    });
    //เรียกใช้ getCurrentDateTime() เพื่อกำหนดค่าเริ่มต้นของ currentDate
    const HOST: string = 'https://backpro-4.onrender.com';
    const url = `${HOST}/facemash/vote`;
    this.getCurrentDateTime(); // เรียกใช้งาน getCurrentDateTime() ใน ngOnInit()
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getCurrentDateTime(); // เรียกใช้งาน getCurrentDateTime() ทุกๆ 1 วินาที
        
      });
      //async vote(winnerPostId: number, loserPostId: number): เมื่อมีการโหวต จะทำการส่งข้อมูลการโหวตไปยัง URL ที่กำหนด โดยใช้ Axios และแสดงข้อความเกี่ยวกับผลการโหวตผ่านทาง Swal.fire ในกรณีที่มีข้อผิดพลาดหรือประสบความสำเร็จ
    try {
      const response = await axios.get(url);
  
      if (Array.isArray(response.data)) {
        this.show = response.data;

        this.PictureID = [this.show[0].post_id, this.show[1].post_id];
      } else {
        console.error('Invalid data format. Expected an array.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async ngOnDestroy() {
    // ยกเลิกการทำงานของ interval เมื่อ component ถูกทำลาย
    this.destroy$.next();
    this.destroy$.complete();
  }

  async vote(winnerPostId: number, loserPostId: number) {
    const URL = 'http://localhost:4000/facemash/vote';
    
    try {
      //await axios.post(URL, { winnerPostId, loserPostId }): ส่งข้อมูลการโหวตไปยัง URL ที่กำหนดโดยใช้ Axios และรอให้การเรียก API เสร็จสมบูรณ์ หากสำเร็จจะได้รับข้อมูลการตอบกลับจากเซิร์ฟเวอร์
        const response = await axios.post(URL, { winnerPostId, loserPostId });
        //console.log('Response data:', response.data): แสดงข้อมูลที่ได้รับจากการโหวตผ่านทาง Console
        console.log('Response data:', response.data);
        //ดึงข้อมูลที่ส่งกลับมาจากเซิร์ฟเวอร์และกำหนดให้กับตัวแปรต่าง ๆ เพื่อให้ง่ายต่อการใช้งาน
        const { updatedWinner, updatedEloRatingWinner, updatedLoser, updatedEloRatingLoser } = response.data;

        if (updatedWinner && updatedLoser) {
            this.updatePostScore(this.show, updatedWinner, updatedEloRatingWinner.newRating);
            this.updatePostScore(this.show, updatedLoser, updatedEloRatingLoser.newRating);
           
            // คำนวณคะแนน Elo Rating ของผู้ชนะ
            const winnerOldRating = updatedEloRatingWinner.oldRating;
            const winnerNewRating = updatedEloRatingWinner.newRating;
            const winnerDelta = winnerNewRating - winnerOldRating;
            const winnerMessage = `ผู้ชนะ Post ID: ${updatedWinner.post_id}, คะแนนเก่า: ${winnerOldRating}, คะแนนใหม่: ${winnerNewRating}, คะแนนที่ได้: ${winnerDelta}`;
            const loserOldRating = updatedEloRatingLoser.oldRating;
            const loserNewRating = updatedEloRatingLoser.newRating;
            const loserDelta = loserNewRating - loserOldRating;
            const loserMessage = `ผู้แพ้ Post ID: ${updatedLoser.post_id}, คะแนนเก่า: ${loserOldRating}, คะแนนใหม่: ${loserNewRating}, คะแนนที่ได้: ${loserDelta}`;
            // แสดงข้อความเมื่อมีการเสียงโหวตเสร็จสมบูรณ์
            const winnerCalculation = `วิธีการคำนวณคะแนนผู้ชนะ: นำคะแนนเก่าของผู้ชนะ (${winnerOldRating}) บวกกับ ${this.K} คูณ (1 - ความน่าจะเป็นที่ผู้ชนะ)`;
            const loserCalculation = `วิธีการคำนวณคะแนนผู้แพ้: นำคะแนนเก่าของผู้แพ้ (${loserOldRating}) บวกกับ ${this.K} คูณ (0 - ความน่าจะเป็นที่ผู้ชนะ)`;
            const finalMessage = `${winnerMessage}<br>${winnerCalculation}<br><br>${loserMessage}<br>${loserCalculation}`;
            let updatedScore = winnerDelta; // คะแนนที่คำนวณได้
            let updatedScoreText = `(${updatedScore > 0 ? '+' : ''}${updatedScore})`;
            let calculationMessage = `วิธีการคำนวณคะแนนผู้ชนะ: นำคะแนนเก่าของผู้ชนะ (${updatedEloRatingWinner.oldRating}) `;
            calculationMessage += `เพิ่มหรือลดด้วยคะแนนที่คำนวณได้ ${updatedScoreText}`;

            Swal.fire({
                title: 'โหวตสำเร็จ!',
                html: finalMessage,
                icon: 'success'
            });
        } else {
            // แสดงข้อความเมื่อมีข้อผิดพลาด
            Swal.fire({
                title: 'เกิดข้อผิดพลาด!',
                text: 'ไม่สามารถบันทึกโหวตได้',
                icon: 'error'
            });
        }
    } catch (error) {
        console.error('Error processing vote:', error);
        // แสดงข้อความเมื่อมีข้อผิดพลาด
        Swal.fire({
            title: 'เกิดข้อผิดพลาด!',
            text: 'ไม่สามารถบันทึกโหวตได้',
            icon: 'error'
        });
    }
}



 //ค้นหา index ของโพสต์ที่ต้องการอัปเดตในอาร์เรย์ postArray โดยใช้ findIndex เพื่อหา index ของโพสต์ที่มี post_id เท่ากับ updatedPost.post_id
  updatePostScore(postArray: any[], updatedPost: { post_id: any; }, newRating: any) {
    const postIndex = postArray.findIndex(post => post.post_id === updatedPost.post_id);
    //ตรวจสอบว่าโพสต์ที่ต้องการอัปเดตมีอยู่ในอาร์เรย์หรือไม่ โดยเช็คค่า postIndex ว่าไม่เท่ากับ -1 ซึ่งหมายความว่าโพสต์นั้นพบอยู่ในอาร์เรย์
    if (postIndex !== -1) {
        const oldScore = postArray[postIndex].score;
        postArray[postIndex].score = newRating;
  
        console.log(`Post ID: ${updatedPost.post_id}, Old Score: ${oldScore}, New Score: ${newRating}`)
         //const oldScore = postArray[postIndex].score;: เก็บค่าคะแนนเดิมของโพสต์ที่จะอัปเดตไว้ในตัวแปร oldScore
        // แสดง Swal.fire เฉพาะ Post ID ที่ชนะ
        //postArray[postIndex].score = newRating;: อัปเดตคะแนนของโพสต์ในอาร์เรย์ postArray ด้วยคะแนนใหม่ที่ได้หลังจากการโหวต
        if (newRating > oldScore) {
            Swal.fire({
              title: `You Vote Post ID: ${updatedPost.post_id}`,
              text: `Old Score: ${oldScore}, New Score: ${newRating}`,
              icon: "success"
            }).then(() => {
              // รีโหลดหน้าเว็บเมื่อกด OK
              // window.location.reload();
            });
        }
    }
  }

  getCurrentDateTime() {
    const currentDate = new Date();
    this.currentDate = currentDate.toLocaleString();
  }
  toProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.router.navigate(['/']);
  }
  check(userId: string) {
    this.router.navigate(['/home'] ,{ queryParams: { user_id: userId } });
  }
}